import { Component } from "../Component.js";

export default class OrGate extends Component {
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
      output = inputs[0] || inputs[1];

      // at least 1 input is floating -> if 1 input equals to true -> true, else floating
    } else {
      output = inputs[0] === true || inputs[1] === true ? true : undefined;
    }

    return output;
  }

  getTruthTable() {
    var truthTable = [];
    for (let i = 0; i < 2; ++i) {
      for (let j = 0; j < 2; ++j) {
        truthTable.push([[i, j], this.getResult([i, j])]);
      }
    }

    return truthTable;
  }
}
