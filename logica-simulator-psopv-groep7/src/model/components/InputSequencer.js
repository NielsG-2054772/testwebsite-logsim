import { Component } from "../Component.js";

export default class InputSequencer extends Component {
  constructor(id, values) {
    super(id);

    // default value for values
    if (values == undefined) {
      values = [
        {
          value: 0,
          "timing:": 0,
        },
      ];
    }

    this._val = values[0]["value"]; // starting value
    this._timing = 0; // starting timing
    this._values = values; // array of values with timing
    this._currIndex = 0;
    this._isInputSequencer = true;
    this.currentTimeout = null;
  }

  evaluate() {
    if (this._outputs.length <= 0) {
      return;
    }
    this._outputs[0].forEach((output) => {
      output.value = this._val;
    });
    if (this._currIndex < this._values.length) {
      this._timing = this._values[this._currIndex]["timing"];
      this._val = this._values[this._currIndex]["value"];
      this._currIndex++;
    }
  }

  reset() {
    this.stopTimer();
    this._timing = 0;
    this._val = this._values[0]["value"];
    this._currIndex = 0;
  }

  addToQueue(t, startSimulation) {
    t.simulationQueue.push(this);
    if (!t.onGoing && startSimulation) {
      t.startSimulation();
    }
  }

  setTimer(t, startSimulation = true) {
    var total = this._timing;
    var k = this;
    this._values.forEach((value) => {
      k.currentTimeout = setTimeout(() => {
        k.addToQueue(t, startSimulation);
      }, total);
      total += value["timing"];
    });
  }

  stopTimer() {
    if (this.currentTimeout != null) {
      clearTimeout(this.currentTimeout);
    }
  }

  get timing() {
    return this._timing;
  }
  get values() {
    return this._values;
  }
  set values(values) {
    this._values = values;
  }
}
