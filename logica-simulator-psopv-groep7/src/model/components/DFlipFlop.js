import { Component } from '../Component.js'

export default class DFlipFlop extends Component {

    constructor(id) {
        super(id);

        this._prevOutput = undefined;
        this._evalsOnHighClock = 0;
    }

    // calculates the next value, but doesn't give it to the connected wire yet
    evaluate(inputs) {
        if (this._outputs.length <= 0) {
            return
        }

        var output = this.getResult(inputs);

        if (this._evalsOnHighClock !== 1) {
            return;
        }
        
        this._outputs[0].forEach(wire => {
            wire.value = output;
        })

        output = !output;
        
        if (this._outputs[1] !== undefined) {
            this._outputs[1].forEach(wire => {
                wire.value = output;
            })
        }
    }

    getResult(inputs) {
        var output

        var clock = inputs[1];
        var D = inputs[0];

        if (D === undefined) {
            D = false;
        }
        
        if (clock) {
            this._prevOutput = output;
            output = D;
            ++this._evalsOnHighClock;
        } else {
            output = this._prevOutput;
            this._evalsOnHighClock = 0;
        }

        return output;
    }

    getTruthTable() {
        // get all possible combinations of 2 0's and 1's
        var truthTable = [];
        return truthTable;
    }

    reset() {
        this._prevOutput = undefined;
        this._evalsOnHighClock = 0;
    }
}