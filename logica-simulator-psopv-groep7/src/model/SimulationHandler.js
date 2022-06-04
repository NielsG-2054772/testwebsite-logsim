import store from "@/store";
import SimulationQueue from "./SimulationQueue";

export default class SimulationHandler {
  simulationQueue = new SimulationQueue();
  _count = 0;
  recentlyUpdatedWires = [];
  views = [];
  clockIntervals = [];
  inputSequencers = [];
  onGoing = false;

  addView(view) {
    this.views.push(view);
  }

  startSimulation() {
    this.onGoing = true;
    var numComponents = store.getters["simulationStore/componentStore/getNumberOfComponents"];
    // keep simulating until no more elements have to be simulated
    while (
      this.onGoing &&
      !this.simulationQueue.isEmpty() &&
      this._count < 10 * numComponents
    ) {
      this._doIteration();
      ++this._count;
    }
    
    if (this._count >= 10 * numComponents && numComponents > 0) {
      this.views.forEach(view => {
        if (view.openErrorModal) {
          view.openErrorModal("error_oscillation");
        }

      })
    }
    
    this._count = 0;
    this.onGoing = false;
  }
  get count(){
    return this._count;
  }
  stopSimulation() {
    this.onGoing = false;

    this.clockIntervals.forEach((interval) => {
      clearInterval(interval);
    });

    this.inputSequencers.forEach((inputSequencer) => {
      inputSequencer.reset();
    });

    this.clockIntervals = [];
    this.simulationQueue.clear();
  }

  addToSimulation(component, startClockSimulation = true, startSimulation = startClockSimulation) {
    this.simulationQueue.push(component);
    // set up interval for clock
    if (component.timing !== undefined) {
      var t = this;
      var intervalId = component.setTimer(t, startClockSimulation);
      //   var intervalId = setInterval(function () {
      //     t.simulationQueue.push(component);

      //     if (!t.onGoing) {
      //       t.startSimulation();
      //     }
      //   }, component.timing);
      if (component._isInputSequencer) {
        this.inputSequencers.push(component);
      }
      this.clockIntervals.push(intervalId);
    }

    if (!this.onGoing && startSimulation) {
      this.startSimulation();
    }
  }

  addMultipleToSimulation(components, startSimulation = true) {
    components.forEach((component) => {
      this.addToSimulation(component, startSimulation, false);
    });

    // only start simulation after everything has been added
    if (!this.onGoing && startSimulation) {
      this.startSimulation();
    }
  }

  _doIteration() {
    var inputs = [];
    var priority = this.simulationQueue.getPriorityOfFirstElement();
    var components = [];

    // find all components that should be evaluated in this batch (same priority)
    while (
      !this.simulationQueue.isEmpty() &&
      priority == this.simulationQueue.getPriorityOfFirstElement()
    ) {
      inputs.push(this.simulationQueue.getInputValuesOfFirstElement());
      components.push(this.simulationQueue.pop());
    }
    
    // evaluate and propagate the calculated values
    for (let i = 0; i < components.length; ++i) {
      components[i].evaluate(inputs[i]);
    }

    // decrease priority of all remaining components (as now that amount of time has passed)
    this.simulationQueue.decreasePriorityOfAll(priority);
  
    // add any components that now have to be evaluated again
    components.forEach((component) => {
      component.outputs.forEach((wires) => {
        wires.forEach(wire => {
          if (wire !== undefined && wire._hasChanged) {
            wire.outputs.forEach((toAdd) => {
              this.simulationQueue.push(toAdd);
            });
            this.recentlyUpdatedWires.push(wire);
            wire.hasChanged = false;
          }
        })
      });
    });

    // update all connected views
    this.views.forEach((view) => {
      view.update();
    });
  }

  getRecentlyUpdatedWires() {
    return this.recentlyUpdatedWires;
  }

  nextStep() {
    var empty = this.simulationQueue.isEmpty();
    if (!empty) {
      this._doIteration();
    } 

    return !empty; // if it returns false, it means there is no next step available!
  }
}
