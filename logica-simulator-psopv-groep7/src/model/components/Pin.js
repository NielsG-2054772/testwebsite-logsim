import { Component } from "../Component.js";

export default class Pin extends Component {
  constructor(id) {
    super(id);
    this._state = undefined;
  }

  // calculates the next value, but doesn't give it to the connected wire yet
  evaluate() {
    if (this._outputs.length <= 0) {
      return;
    }

    this._outputs[0].forEach((output) => {
      if (output != undefined) {
        output.value = this._state;
      }
    });
  }

  reset() {
    this._state = undefined;
  }

  set state(state) {
    this._state = state;
  }
  get state() {
    return this._state;
  }
}
