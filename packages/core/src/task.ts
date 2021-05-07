/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, createController } from './controller/controller';
import { Operation } from './operation';
import { Deferred } from './deferred';
import { Trapper } from './trapper';
import { swallowHalt } from './halt-error';
import { EventEmitter } from 'events';
import { StateMachine, State, StateTransition } from './state-machine';
import { HaltError } from './halt-error';

let COUNTER = 0;
const CONTROLS = Symbol.for('effection/v2/controls');

export interface TaskOptions {
  resourceScope?: Task;
  blockParent?: boolean;
  ignoreChildErrors?: boolean;
  ignoreError?: boolean;
}

type WithControls<TOut> = { [CONTROLS]?: Controls<TOut> }
type EnsureHandler = () => void;

export interface Task<TOut = unknown> extends Promise<TOut> {
  readonly id: number;
  readonly state: State;
  catchHalt(): Promise<TOut | undefined>;
  spawn<R>(operation?: Operation<R>, options?: TaskOptions): Task<R>;
  halt(): Promise<void>;
}

export interface Controls<TOut = unknown> {
  options: TaskOptions;
  children: Set<Task>;
  result?: TOut;
  error?: Error;
  start(): void;
  halted(): void;
  resolve(value: TOut): void;
  reject(error: Error): void;
  ensure(fn: EnsureHandler): void;
  link(child: Task): void;
  unlink(child: Task): void;
  addTrapper(trapper: Trapper): void;
  removeTrapper(trapper: Trapper): void;
  trap: Trapper;
  on(name: 'state', listener: (transition: StateTransition) => void): void;
  on(name: 'link', listener: (child: Task) => void): void;
  on(name: 'unlink', listener: (child: Task) => void): void;
  on(name: string, listener: (...args: any[]) => void): void;
  off(name: 'state', listener: (transition: StateTransition) => void): void;
  off(name: 'link', listener: (child: Task) => void): void;
  off(name: 'unlink', listener: (child: Task) => void): void;
  off(name: string, listener: (...args: any[]) => void): void;
}

export function createTask<TOut = unknown>(operation: Operation<TOut>, options: TaskOptions = {}): Task<TOut> {
  let id = ++COUNTER;

  let children = new Set<Task>();
  let trappers = new Set<Trapper>();
  let ensureHandlers = new Set<EnsureHandler>();
  let emitter = new EventEmitter();

  let stateMachine = new StateMachine(emitter);

  let deferred = Deferred<TOut>();
  deferred.promise.catch(() => {
    // prevent uncaught promise warnings
  });

  function resume() {
    if(stateMachine.isFinishing && children.size === 0) {
      stateMachine.finish();

      ensureHandlers.forEach((handler) => handler());
      trappers.forEach((trapper) => trapper(task as Task));

      ensureHandlers.clear();
      trappers.clear();

      if(stateMachine.current === 'completed') {
        // TODO: model state as a union so we do not need this non-null assertion
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        deferred.resolve(controls.result!);
      } else if(stateMachine.current === 'halted') {
        deferred.reject(new HaltError());
      } else if(stateMachine.current === 'errored') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        deferred.reject(controls.error!);
      }
    }
  }

  function haltChildren(force: boolean) {
    for(let child of Array.from(children).reverse()) {
      let controls = getControls(child);
      if(force || !controls.options.blockParent) {
        // Continue halting once the first found child has been fully halted.
        // The child will always have been removed from the Set when this runs.
        controls.addTrapper(() => haltChildren(force));
        child.halt()
        return;
      }
    }
  }

  let controls: Controls<TOut> = {
    options,

    children,

    start() {
      stateMachine.start();
      controller.start();
    },

    resolve: (result: TOut) => {
      stateMachine.resolve();
      controls.result = result;
      haltChildren(false);
      resume();
    },

    reject: (error: Error) => {
      stateMachine.reject();
      controls.result = undefined; // clear result if it has previously been set
      controls.error = error;
      haltChildren(true);
      resume();
    },

    ensure(fn) {
      ensureHandlers.add(fn)
    },

    halted: () => {
      stateMachine.halt();
      haltChildren(true);
      resume();
    },

    link(child) {
      if(!children.has(child)) {
        getControls(child).addTrapper(controls.trap);
        children.add(child);
        emitter.emit('link', child);
      }
    },

    unlink(child) {
      if(children.has(child)) {
        getControls(child).removeTrapper(controls.trap);
        children.delete(child);
        emitter.emit('unlink', child);
      }
    },

    trap(child) {
      if(children.has(child)) {
        if(child.state === 'errored' && !getControls(child).options.ignoreError && !options.ignoreChildErrors) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          controls.reject(getControls(child).error!);
        }
        controls.unlink(child);
      }
      resume();
    },

    addTrapper(trapper) {
      trappers.add(trapper);
    },

    removeTrapper(trapper) {
      trappers.delete(trapper);
    },

    on: (name: string, listener: (...args: any[]) => void) => { emitter.on(name, listener) },
    off: (name: string, listener: (...args: any[]) => void) => { emitter.off(name, listener) },
  };

  let controller: Controller<TOut>;

  let task: Task<TOut> & WithControls<TOut> = {
    id,

    get state() { return stateMachine.current; },

    catchHalt() {
      return deferred.promise.catch(swallowHalt);
    },

    spawn(operation?, options = {}) {
      if(stateMachine.current !== 'running') {
        throw new Error('cannot spawn a child on a task which is not running');
      }
      if(!options.resourceScope) {
        options.resourceScope = task;
      }
      let child = createTask(operation, options);
      controls.link(child as Task);
      getControls(child).start();
      return child;
    },

    async halt() {
      controller.halt();
      await deferred.promise.catch(() => {
        // TODO: should this catch all errors, or only halt errors?
        // see https://github.com/jnicklas/mini-effection/issues/23
      });
    },
    then: (...args) => deferred.promise.then(...args),
    catch: (...args) => deferred.promise.catch(...args),
    finally: (...args) => deferred.promise.finally(...args),
    [Symbol.toStringTag]: `[Task ${id}]`,
    [CONTROLS]: controls,
  }

  controller = createController(task, operation);

  return task;
};

export function getControls<TOut>(task: Task<TOut>): Controls<TOut> {
  let controls = (task as WithControls<TOut>)[CONTROLS];
  if(!controls) {
    throw new Error(`EFFECTION INTERNAL ERROR unable to retrieve controls for task ${task}`);
  }
  return controls;
}
