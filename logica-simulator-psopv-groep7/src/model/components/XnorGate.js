import { Component } from "../Component.js";

export default class XnorGate extends Component {
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
      wire.value = output;
    });
  }

  getResult(inputs) {
    var output;

    // no input is floating
    if (inputs[0] !== undefined && inputs[1] !== undefined) {
      output = (inputs[0] + inputs[1] + 1) % 2;

      // at least 1 input is floating -> always floating
    } else {
      output = undefined;
    }

    return Boolean(output);
  }

  getTruthTable() {
    var truthTable = [];
    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < 2; ++j) {
        truthTable.push([[i, j], +this.getResult([i, j])]);
      }
    }

    return truthTable;
  }
}
