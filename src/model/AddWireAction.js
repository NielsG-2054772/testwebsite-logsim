import { Action } from "@/model/Action";
import RemoveWireAction from "@/model/RemoveWireAction";

export default class AddWireAction extends Action {
    constructor(id, inputId, outputId, entryFrom, entryTo, isCustom, inflPoints,inTop, outTop, path, view) {
        super();
        this._id = id;
        this._inputId = inputId;
        this._outputId = outputId;
        this._entryFrom = entryFrom;
        this._entryTo = entryTo;
        this._isCustom = isCustom;
        this._inflPoints = inflPoints;
        this._path = path;
        this._view = view;
        this._inTop = inTop;
        this._outTop = outTop;
    }

    execute() {
        // add wire in view
        if (this._view != undefined) {
            this._view.addWire(this._id, this._inputId, this._outputId, this._entryFrom, this._entryTo, this._isCustom, this._inflPoints, this._inTop, this._outTop, this._path, false);
        }
    }

    getReverse() {
        var action = new RemoveWireAction(this._id, this._inputId, this._outputId, this._entryFrom, this._entryTo, this._isCustom, this._inflPoints, this._inTop, this._outTop,this._path, this._view);
        return action
    }
}