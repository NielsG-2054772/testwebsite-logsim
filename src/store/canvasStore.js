import store from "./index.js";

const state = {
  current: "empty",
  openLogicAnalyser: false,
  openImageModal: false,
  saveLoadWatcher: "empty",
  UndoStack: [],
  RedoStack: [],
  currLanguage: "eng",
};

const getters = {
  getCurrent(state) {
    return state.current;
  },
  popUndoStack(state) {
    return state.UndoStack.pop();
  },
  getOpenLogicAnalyzer(state) {
    return state.openLogicAnalyser;
  },
  getOpenImageModal(state) {
    return state.openImageModal;
  },
  getSaveLoadWatcher(state) {
    return state.saveLoadWatcher;
  },
  popRedoStack(state) {
    return state.RedoStack.pop();
  },
  getCurrLanguage() {
    if (localStorage.getItem("lang") === null) {
      return "eng";
    } else {
      return localStorage.getItem("lang");
    }
  },
};
const mutations = {
  setCurrent(state, payload) {
    state.current = payload;
  },
  emptyCurrent(state) {
    state.current = "empty";
  },
  pushUndoStack(state, payload) {
    state.UndoStack.push(payload);
  },
  pushRedoStack(state, payload) {
    state.RedoStack.push(payload);
  },
  setOpenLogicAnalyzer(state, payload) {
    state.openLogicAnalyser = payload;
  },
  setOpenImageModal(state, payload) {
    state.openImageModal = payload;
  },
  setSaveLoadWatcher(state, payload) {
    state.saveLoadWatcher = payload;
  },
  setCurrLanguage(state, payload) {
    state.currLanguage = payload;
    localStorage.setItem("lang", payload);
  },
};
const actions = {
  batchUndoStack(state, payload) {
    var actions = [];
    for (let i = 0; i < payload.amount; ++i) {
      actions.push(store.getters["canvasStore/popUndoStack"]);
    }
    store.commit("canvasStore/pushUndoStack", actions);
  },
  clearUndoStack(state) {
    state.state.UndoStack = [];
  },
  clearRedoStack(state) {
    state.state.RedoStack = [];
  },
};
// const modules = {
//   }

export default {
  namespaced: true,
  mutations,
  getters,
  actions,
  state,
};
