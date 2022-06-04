import AndGate from "@/model/components/AndGate";
import OrGate from "@/model/components/OrGate";
import NorGate from "@/model/components/NorGate";
import XnorGate from "@/model/components/XnorGate";
import XorGate from "@/model/components/XorGate";
import Wire from "@/model/components/Wire";
import Pin from "@/model/components/Pin";
import Clock from "@/model/components/Clock";
import NotGate from "@/model/components/NotGate";
import NandGate from "@/model/components/NandGate";
import LogicAnalyser from "@/model/components/LogicAnalyser";
import InputSequencer from "@/model/components/InputSequencer";
import LED from "@/model/components/LED";
import DFlipFlop from "@/model/components/DFlipFlop";
import SRLatch from "@/model/components/SRLatch";

const state = {
  components: new Map(),
  wires: new Map(),
  inputs: [],
  logicAnalysers: [],
};

const getters = {
  getComponent: (state) => (payload) => {
    var temp = state.components.get(payload.id);
    if (temp !== undefined) {
      return temp.component;
    }
    return undefined;
  },
  getComponentDelay: (state) => (payload) => {
    try {
      var component = state.components.get(payload.id).component;
      if (component !== undefined) {
        return component.delay;
      }
      return undefined;
    } catch(e) {
      document.location.reload(true);
    }
  },
  getWire: (state) => (payload) => {
    var temp = state.wires.get(payload.id);
    if (temp !== undefined) {
      return temp.wire;
    }

    return undefined;
  },

  getValueOfPinOrLed(state) {
    return function (payload) {
      var pin = state.components.get(payload.id);
      if (pin !== undefined) {
        return pin.component.state;
      }
      return undefined;
    };
  },

  getInputComponents(state) {
    return state.inputs;
  },

  getLogicAnalysers(state) {
    return state.logicAnalysers;
  },

  getLogicAnalysercount(state) {
    return state.logicAnalysers.length;
  },

  hasComponentOfId(state, payload) {
    return state.components.has(payload.id);
  },
  hasWireOfId(state) {
    return function (payload) {
      return state.wires.has(payload.id);
    };
  },
  getComponentOfType(payload) {
    switch (payload.type) {
      case "and-gate":
        return new AndGate(payload.id);
      case "or-gate":
        return new OrGate(payload.id);
      case "nor-gate":
        return new NorGate(payload.id);
      case "xnor-gate":
        return new XnorGate(payload.id);
      case "xor-gate":
        return new XorGate(payload.id);
      case "not-gate":
        return new NotGate(payload.id);
      case "nand-gate":
        return new NandGate(payload.id);
      case "pin":
        return new Pin(payload.id);
      case "clock":
        return new Clock(payload.id, payload.timing);
      case "logic-analyser":
        return new LogicAnalyser(payload.id);
      case "input-sequencer":
        return new InputSequencer(payload.id, payload.values);
      case "LED":
        return new LED(payload.id);
      case "d-flipflop":
        return new DFlipFlop(payload.id);
      case "sr-latch":
        return new SRLatch(payload.id);
    }
  },
  getClockTiming: (state) => (payload) => {
    var component = state.components.get(payload.id);
    if (component !== undefined) {
      return component.component.timing;
    }
    return undefined;
  },
  getInputSequencerValues: (state) => (payload) => {
    var component = state.components.get(payload.id).component;
    if (component !== undefined) {
      return component.values;
    }
    return undefined;
  },
  getTruthTable() {
    return function (payload) {
      var component = getters.getComponentOfType({ type: payload });
      if (component !== undefined && component.getTruthTable !== undefined) {
        return component.getTruthTable();
      }
    };
  },

  getNumberOfComponents(state) {
    return state.components.size;
  },
};

const mutations = {
  addComponent(state, payload) {
    state.components.set(payload.id, {
      id: payload.id,
      component: payload.component,
    });
  },

  removeComponent(state, payload) {
    // model has a component with this id?
    if (getters.hasComponentOfId(state, payload)) {
      var newArr = [];

      state.inputs.forEach((input) => {
        if (input.id != payload.id) {
          newArr.push(input);
        }
      });

      state.inputs = newArr;
      var newLogicAnalysers = [];

      state.logicAnalysers.forEach((input) => {
        if (input.id !== payload.id) {
          newLogicAnalysers.push(input);
        }
      });

      state.logicAnalysers = newLogicAnalysers;

      state.components.delete(payload.id);
    }
  },

  addInput(state, payload) {
    state.inputs.push(payload.component);
  },

  addLogicAnalyser(state, payload) {
    state.logicAnalysers.push(payload.component);
  },

  addWire(state, payload) {
    state.wires.set(payload.id, {
      id: payload.id,
      wire: payload.wire,
    });
  },

  removeWire(state, payload) {
    state.wires.delete(payload.id);
  },

  setComponentDelay(state, payload) {
    var component = state.components.get(payload.id).component;
    component.delay = payload.delay;
  },
  setClockTiming(state, payload) {
    var clock = state.components.get(payload.id).component;
    clock.timing = payload.timing;
  },
  setInputSequencerValues(state, payload) {
    var inputSequencer = state.components.get(payload.id).component;
    inputSequencer.values = payload.values;
  },
  setLogicAnalyserViewId(state,payload){
    var logicAnalyser = state.components.get(payload.id).component;
    logicAnalyser.viewId = payload.viewId;
  },
};

const actions = {
  //payload bevat soort component, id
  addNewComponentOfType(state, payload) {
    // this id isn't yet in the model
    if (!getters.hasComponentOfId(state.state, payload)) {
      var component = getters.getComponentOfType(payload);
      state.commit("addComponent", {
        id: payload.id,
        component: component,
      });

      // add to input list
      if (
        payload.type == "pin" ||
        payload.type == "clock" ||
        payload.type == "input-sequencer"
      ) {
        state.commit("addInput", {
          id: payload.id,
          component: component,
        });
      }

      if (payload.type == "logic-analyser") {
        state.commit("addLogicAnalyser", {
          id: payload.id,
          component: component,
        });
      }
    }
  },

  setInputValue(state, payload) {
    if (state.state.components.has(payload.id)) {
      var pin = state.state.components.get(payload.id).component;

      pin.state = payload.value;
    }
  },

  // will toggle the value of pin to the next value
  togglePinValue(state, payload) {
    if (state.state.components.has(payload.id)) {
      var pin = state.state.components.get(payload.id).component;
      if (pin.state === undefined) {
        pin.state = false;
      } else if (pin.state === false) {
        pin.state = true;
      } else {
        pin.state = false;
      }
    }
  },

  //payload bevat id van te connecteren componenten welke in en welke out is
  addWire(state, payload) {
    // add the wire
    var wire = new Wire(payload.id);
    state.commit("addWire", {
      id: payload.id,
      wire: wire,
    });

    // get connnected components
    var inputComponent = getters.getComponent(state.state)({
      id: payload.inputId,
    });
    var outputComponent = getters.getComponent(state.state)({
      id: payload.outputId,
    });

    // add compoRnents to wire (and check if they actually exist) and wire to components
    if (inputComponent !== undefined) {
      wire.input = inputComponent;

      // attach to exact output pin of component
      if (payload.numOutput !== undefined) {
        if (inputComponent.outputs.length <= payload.numOutput) {
          for (
            let i = inputComponent.outputs.length;
            i <= payload.numOutput;
            i++
          ) {
            inputComponent.outputs.push([]);
          }
        }
        inputComponent.outputs[payload.numOutput].push(wire);
      } else {
        inputComponent.outputs.push([wire]);
      }
    }

    if (outputComponent !== undefined) {
      wire.outputs.push(outputComponent);

      // attach to exact input pin of component
      if (payload.numInput !== undefined) {
        if (outputComponent.inputs.length <= payload.numInput) {
          for (
            let i = outputComponent.inputs.length;
            i <= payload.numInput;
            i++
          ) {
            outputComponent.inputs.push(undefined);
          }
        }
        outputComponent.inputs[payload.numInput] = wire;
      } else {
        outputComponent.inputs.push(wire);
      }
    }
  },

  resetAll(state) {
    state.state.components.forEach((component) => {
      if (component.component.reset) {
        component.component.reset();
      }
    });

    state.state.wires.forEach((wire) => {
      if (wire.wire.reset) {
        wire.wire.reset();
      }
    });
  },

  removeWire(state, payload) {
    var wire = state.state.wires.get(payload.id);
    if (wire !== undefined) {
      
      // remove this  wire from input component
      wire.wire.input.outputs.forEach(output => {
        var index = output.indexOf(wire.wire);
        if (index != -1) {
          output.splice(index, 1);
        }
      });

      // remove this wire from output components
      wire.wire.outputs.forEach((output) => {
        var index = output.inputs.indexOf(wire.wire);
        if (index != -1) {
          output.inputs[index] = undefined;
        }
      });
    }
  },
  clearComponents(state) {
    state.state.components.clear();
    state.state.wires.clear();
    state.state.inputs = [];
    state.state.logicAnalysers = [];
  },
};

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state,
};
