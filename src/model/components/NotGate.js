import { Component } from "../Component.js";

export default class NotGate extends Component {
  constructor(id) {
    super(id);
  }

  // calculates the next value, but doesn't give it to the connected wire yet
  evaluate(inputs) {
    var output = this.getResult(inputs);
    if (this._outputs.length <= 0) {
      return;
    }

    this._outputs[0].forEach((wire) => {
      if (wire !== undefined) {
        wire.value = output;
      }
    });
  }

  getResult(inputs) {
    var output;

    // no input is floating
    if (inputs[0] !== undefined) {
      output = !inputs[0];

      // input is floating -> output as well
    } else {
      output = undefined;
    }

    return output;
  }

  getTruthTable() {
    var truthTable = [];
    for (let i = 0; i < 2; ++i) {
      truthTable.push([[i], +this.getResult([i])]);
    }
    return truthTable;
  }
}
