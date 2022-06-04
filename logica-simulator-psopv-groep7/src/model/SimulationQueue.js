const top = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class SimulationQueueElement {
  constructor(element) {
    this._element = element
    this._priority = element.delay
    this._inputs = []

    element.inputs.forEach(input => {
      if (input !== undefined) {
        this._inputs.push(input.value)
      } else {
        this._inputs.push(undefined)
      }
    })
  }

  decreasePriority(value) { this._priority -= value }
    get element() { return this._element }
    get priority() { return this._priority }
    get inputs() { return this._inputs }
  }

// https://stackoverflow.com/a/42919752
export default class SimulationQueue {

  constructor(comparator = (a, b) => a.priority < b.priority) {
    this._heap = [];
    this._comparator = comparator;
  }

  clear() {
    this._heap = [];
  }
  
  size() {
    return this._heap.length;
  }

  isEmpty() {
    return this.size() == 0;
  }

  peek() {
    return this._heap[top].element;
  }

  push(...values) {
    values.forEach(value => {
      this._heap.push(new SimulationQueueElement(value));
      this._siftUp();
    });
    return this.size();
  }

  pop() {
    const poppedValue = this._peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue.element;
  }

  replace(value) {
    const replacedValue = this._peek();
    this._heap[top] = value;
    this._siftDown();
    return replacedValue;
  }

  getPriorityOfFirstElement() {
    return this._peek().priority
  }

  decreasePriorityOfAll(value) {
    this._heap.forEach(element => {
      element.decreasePriority(value)
    })
  }

  getInputValuesOfFirstElement() {
    return this._peek().inputs
  }

  _peek() {
    return this._heap[top]
  }

  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }

  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }

  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  
  _siftDown() {
    let node = top;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}
