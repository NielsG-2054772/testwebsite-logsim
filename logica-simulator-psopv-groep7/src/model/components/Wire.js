export default class Wire {
  constructor(id) {
    this._input = undefined;
    this._outputs = [];
    this._hasChanged = false;
    this._value = undefined;
    this._id = id;
  }

  reset() {
    this._hasChanged = false;
    this._value = undefined;
  }

  set value(val) {
    if (this._value != val) {
      this._hasChanged = true;
    }

    this._value = val;
  }

  set hasChanged(val) {
    this._hasChanged = val;
  }
  set input(input) {
    this._input = input;
  }
  set outputs(outputs) {
    this._outputs = outputs;
  }
  get id() {
    return this._id;
  }
  get value() {
    return this._value;
  }
  get hasChanged() {
    return this._hasChanged;
  }
  get input() {
    return this._input;
  }
  get outputs() {
    return this._outputs;
  }
}
