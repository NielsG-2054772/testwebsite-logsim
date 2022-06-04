import { Component } from "../Component.js";

export default class Clock extends Component {
  constructor(id, timing) {
    super(id);
    this._state = undefined;
    this._timing = timing;
  }

  // calculates the next value,
  evaluate() {
    if (this._outputs.length <= 0) {
      return;
    }

    this._outputs[0].forEach((output) => {
      output.value = this._state;
    });

    this._state = !this._state;
  }

  setTimer(t, startSimulation = true) {
    return setInterval(() => {
      t.simulationQueue.push(this);

      if (!t.onGoing && startSimulation) {
        t.startSimulation();
      }
    }, this._timing);
  }

  reset() {
    this._state = undefined;
  }

  set state(state) {
    this._state = state;
  }
  set timing(timing) {
    this._timing = timing;
  }
  get state() {
    return this._state;
  }
  get timing() {
    return this._timing;
  }
}
