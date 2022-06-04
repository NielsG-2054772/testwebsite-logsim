import SimulationHandler from "@/model/SimulationHandler.js";
import store from "./index.js";
import componentStore from "./componentStore.js";

const state = {
  handler: new SimulationHandler(),
};

const getters = {
  
  getWiresToUpdate(state) {
    return state.handler.getRecentlyUpdatedWires();
  },

  amountOfItemsToSimulate(state) {
    return state.handler.simulationQueue.size();
  },
  getCount(state){
    return state.handler.count;
  },
  getHandler(state){
    return state.handler;
  }
};

const mutations = {
};

const actions = {
  startSimulation(state) {
    state.state.handler.startSimulation();
  },
  addComponentToEvaluate(state, payload) {
    var component =
      store.getters["simulationStore/componentStore/getComponent"](payload);
    state.state.handler.addToSimulation(component, payload.startSimulation);
  },

  addAllInputComponents(state, payload) {
    var inputs =
      store.getters["simulationStore/componentStore/getInputComponents"];
    var startsim = true;
    if (payload !== undefined && payload.startSimulation !== undefined) {
      startsim = payload.startSimulation;
    }
    state.state.handler.addMultipleToSimulation(inputs, startsim);
  },
  addView(state, payload) {
    state.state.handler.addView(payload);
  },
  stopSimulation(state) {
    state.state.handler.stopSimulation();
    store.dispatch("simulationStore/componentStore/resetAll");
  },
  nextStep(state) {
    state.state.handler.nextStep();
  },
};

const modules = {
  componentStore,
};

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state,
  modules,
};
