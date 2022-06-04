import { Component } from '../Component.js'

export default class SRLatch extends Component {

    constructor(id) {
        super(id);

        this._prevOutputs = [undefined, undefined];
    }

    // calculates the next value, but doesn't give it to the connected wire yet
    evaluate(inputs) {
        if (this._outputs.length <= 0) {
            return
        }

        var outputs = this.getResult(inputs);
        
        this._outputs[0].forEach(wire => {
            wire.value = outputs[0];
        });

        if (this._outputs[1] !== undefined) {
            this._outputs[1].forEach(wire => {
                wire.value = outputs[1];
            });
        }
    }

    getResult(inputs) {
        // both false or undefined -> propagate previous results
        if (!inputs[0] && !inputs[1]) {
            return this._prevOutputs;
        }
        
        // S set
        if (inputs[0] === true && !inputs[1]) {
            this._prevOutputs = [true, false];
            return this._prevOutputs;
        }

        // R set
        if (inputs[1] === true && !inputs[0]) {
            this._prevOutputs = [false, true];
            return this._prevOutputs;
        }

        // both set / undefined -> inderminate (if built with nor gates -> false)
        this._prevOutputs = [false, false];
        return this._prevOutputs;
    }

    getTruthTable() {
        // get all possible combinations of 2 0's and 1's
        var truthTable = [];
        return truthTable;
    }

    reset() {
        this._prevOutputs = [undefined, undefined];
    }
}