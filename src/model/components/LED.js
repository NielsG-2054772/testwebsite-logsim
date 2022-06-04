import { Component } from "../Component.js";

export default class LED extends Component {
  constructor(id) {
    super(id);
    this._state = false;
  }

  // calculates the next value, but doesn't give it to the connected wire yet
  evaluate(inputs) {
    this.state = inputs[0];
    if (this._outputs.length <= 0) {
      return;
    }

    this._outputs[0].forEach((output) => {
      output.value = this._state;
    });
  }

  reset() {
    this._state = false;
  }

  set state(state) {
    this._state = state;
  }
  get state() {
    return this._state;
  }
}
