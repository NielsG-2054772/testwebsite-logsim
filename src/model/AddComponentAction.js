import { Action } from "@/model/Action";
import RemoveComponentAction from "@/model/RemoveComponentAction";

export default class AddComponentAction extends Action {

    constructor(type, id, view, pos, timing = undefined, values = undefined) {
        super();
        this._type = type;
        this._id = id;
        this._timing = timing; // timing for clock
        this._values = values; // values for input sequencer
        this._pos = pos
        this._view = view;
    }

    execute() {
        // add in view
        if (this._view !== undefined) {
            this._view.addComponent(this._pos, this._type, this._id, false, {timing: this._timing, values: this._values});
        }
    }

    getReverse() {
        var action = new RemoveComponentAction(this._type, this._id, this._view, this._pos, this._timing, this._values);
        return action
    }
}