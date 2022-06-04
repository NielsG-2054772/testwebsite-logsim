import { Action } from "@/model/Action";
import AddComponentAction  from "./AddComponentAction";

export default class RemoveComponentAction extends Action {
    constructor(type, id, view, pos, timing = undefined, values = undefined) {
        super();
        this._type = type;
        this._id = id;
        this._timing = timing;
        this._values = values;
        this._pos = pos
        this._view = view;
    }
    
    execute() {
        // remove from view
            if (this._view !== undefined) {
            this._view.removeComponent(this._pos, false);
        }
    }

    getReverse() {
        var action = new AddComponentAction(this._type, this._id, this._view, this._pos, this._timing, this._values);
        return action 
    }
}