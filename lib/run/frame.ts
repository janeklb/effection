import type { Frame, Instruction, Operation, Result } from "../types.ts";

import { evaluate, shift } from "../deps.ts";
import { shiftSync } from "../shift-sync.ts";
import { lazy } from "../lazy.ts";
import { Err, Ok } from "../result.ts";

import type { Exit, FrameResult } from "./types.ts";
import { createValue } from "./value.ts";
import { createTask } from "./task.ts";

export interface FrameOptions<T> {
  operation(): Operation<T>;
  parent?: Frame["context"];
}

export function createFrame<T>(options: FrameOptions<T>): Frame<T> {
  return evaluate<Frame<T>>(function* () {
    let { operation, parent } = options;

    let [setResults, results] = yield* createValue<FrameResult<T>>();

    let context = Object.create(parent ?? {});

    let frame = yield* shiftSync<Frame<T>>((k) =>
      new FrameImpl(context, results, k.tail)
    );

    let { children, thunks } = frame;

    let iterator = lazy(() => operation()[Symbol.iterator]());

    let thunk = thunks.pop()!;

    while (!thunk.done) {
      let getNext = thunk.value;
      try {
        let next: IteratorResult<Instruction> = getNext(iterator());

        if (next.done) {
          thunks.unshift({ done: true, value: Ok(next.value) });
        } else {
          let instruction = next.value;

          let outcome = yield* shift<InstructionResult>(function* (k) {
            frame.interrupt = () => k.tail({ type: "interrupted" });

            try {
              k.tail({
                type: "settled",
                result: yield* instruction(frame),
              });
            } catch (error) {
              k.tail({ type: "settled", result: Err(error) });
            }
          });

          if (outcome.type === "settled") {
            if (outcome.result.ok) {
              thunks.unshift({
                done: false,
                value: $next(outcome.result.value),
              });
            } else {
              thunks.unshift({
                done: false,
                value: $throw(outcome.result.error),
              });
            }
          }
        }
      } catch (error) {
        thunks.unshift({ done: true, value: Err(error) });
      }
      thunk = thunks.pop()!;
    }

    let result = thunk.value;

    let exit: Exit<T>;

    if (!result.ok) {
      exit = { type: "result", result };
    } else if (frame.crash) {
      exit = { type: "crashed", error: frame.crash };
    } else if (frame.aborted) {
      exit = { type: "aborted" };
    } else {
      exit = { type: "result", result };
    }

    let destruction = Ok(void 0);

    while (children.size !== 0) {
      for (let child of [...children].reverse()) {
        let teardown = yield* child.destroy();
        if (!teardown.ok) {
          destruction = teardown;
        }
      }
    }

    if (!destruction.ok) {
      setResults({ ok: false, error: destruction.error, exit });
    } else {
      if (exit.type === "aborted") {
        setResults({ ok: true, value: void 0, exit });
      } else if (exit.type === "result") {
        let { result } = exit;
        if (result.ok) {
          setResults({ ok: true, value: void 0, exit });
        } else {
          setResults({ ok: false, error: result.error, exit });
        }
      } else {
        setResults({ ok: false, error: exit.error, exit });
      }
    }
  });
}

class FrameImpl<T> implements Frame<T> {
  static ids = 0;

  id = FrameImpl.ids++;
  children = new Set<Frame>();
  thunks = [{ done: false, value: $next(void 0) } as const];
  interrupt = () => {};
  enter: () => void;
  aborted?: boolean;
  crash?: Error;
  //@ts-expect-error I cannot figure this out.
  [Symbol.iterator]: Frame<T>[typeof Symbol.iterator];

  constructor(
    public readonly context: Frame["context"],
    public readonly result: Frame<T>["result"],
    enter: (frame: Frame<T>) => void,
  ) {
    this.enter = () => enter(this);
    this[Symbol.iterator] = result[Symbol.iterator];
  }

  createChild<X>(operation: () => Operation<X>) {
    let { children } = this;
    let child = createFrame<X>({ operation, parent: this.context });
    children.add(child);
    evaluate(function* () {
      yield* child;
      children.delete(child);
    });
    return child;
  }

  getTask() {
    let task = createTask<T>(this as Frame<T>);
    this.getTask = () => task;
    return task;
  }

  destroy(reason?: Error) {
    if (!this.aborted) {
      this.aborted = true;
      this.crash = reason;
      this.thunks.unshift({ done: false, value: $abort() });
      this.interrupt();
    }
    return this;
  }
}

// deno-lint-ignore no-explicit-any
const $next = <T>(value: any) =>
  function $next(i: Iterator<Instruction, T>) {
    return i.next(value);
  };

const $throw = <T>(error: Error) =>
  function $throw(i: Iterator<Instruction, T>) {
    if (i.throw) {
      return i.throw(error);
    } else {
      throw error;
    }
  };

const $abort = <T>(value?: unknown) =>
  function $abort(i: Iterator<Instruction, T>) {
    if (i.return) {
      return i.return(value as unknown as T);
    } else {
      return { done: true, value } as IteratorResult<Instruction, T>;
    }
  };

type InstructionResult =
  | {
    type: "settled";
    result: Result<unknown>;
  }
  | {
    type: "interrupted";
  };
