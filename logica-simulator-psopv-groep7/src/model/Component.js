/* 
* Component class, all gates, flip-flops, etc... derive from this class
*/
export class Component {
    constructor(id, delay = 0) {
        this._delay = delay
        this._inputs = []
        this._outputs = []
        this._id = id
    }

    // setters and getters
    setDelay(delay){
        this._delay = delay;
    }
    set delay(delay) { this._delay = delay }
    set inputs(inputs) { this._inputs = inputs }
    set outputs(outputs) { this._outputs = outputs }
    get delay() { return this._delay }
    get inputs() { return this._inputs }
    get outputs() { return this._outputs }
    get id() { return this._id }
}   
