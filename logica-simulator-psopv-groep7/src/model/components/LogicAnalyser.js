import { Component } from "../Component.js";

export default class LogicAnalyser extends Component {
    constructor(id) {
        super(id);
        this._value = undefined;
        this._viewId = 0;
    }

    evaluate() {
        this._value = this._inputs[0].value

        if (this._outputs[0] !== undefined) {
            this.outputs[0].forEach(output => {
                output.value = this.inputs[0].value
            })
        }
    }

    reset() {
        this._value = undefined;
    }
    set viewId(v){this._viewId = v}
    get viewId() {return this._viewId}
    get value() { return this._value }
}