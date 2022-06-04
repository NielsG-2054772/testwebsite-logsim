import { Action } from "@/model/Action";

export default class MoveComponentAction extends Action {
    constructor(id, pos, newpos, view) {
        super();
        this._id = id;
        this._pos = pos;
        this._newpos = newpos;
        this._view = view;
    }

    execute() {
        if (this._view !== undefined) {
            this._view.moveComponent(this._pos, this._newpos);
        }
    }

    getReverse() {
        var action = new MoveComponentAction(this._id, this._newpos, this._pos, this._view);
        return action
    }
}