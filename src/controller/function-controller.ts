import { Controller } from './controller';
import { OperationFunction } from '../operation';
import { Task, Controls } from '../task';
import { HaltError } from '../halt-error';
import { Deferred } from '../deferred';
import { isPromise } from '../predicates';
import { IteratorController } from './iterator-controller';
import { PromiseController } from './promise-controller';

const HALT = Symbol("halt");

export class FunctionContoller<TOut> implements Controller<TOut> {
  private haltSignal: Deferred<typeof HALT> = Deferred();
  private startSignal: Deferred<{ controller: Controller<TOut> }> = Deferred();
  private controller?: Controller<TOut>;

  constructor(private task: Task<TOut>, private controls: Controls<TOut>, private operation: OperationFunction<TOut>) {
  }

  start() {
    let result;
    try {
      result = this.operation(this.task);
    } catch(error) {
      this.task.reject(error);
      return;
    }
    let controller;
    if(isPromise(result)) {
      controller = new PromiseController(this.controls, result);
    } else {
      controller = new IteratorController(this.controls, result);
    }
    this.controller = controller;
    controller.start();
  }

  async halt() {
    if(this.controller) {
      this.controller.halt();
    } else {
      throw new Error('INTERNAL ERROR: halt called before start, this should never happen');
    }
  }
}
