import store from "../../store/index.js";
import drawMixin from "@/model/mixins/drawMixin.js";
import editMixin from "@/model/mixins/editMixin.js";
export default {
  methods: {
    /**
     * Function that saves the entire circuit to local storage
     */
    saveToLocal() {
      let obj = JSON.stringify({ version: 1 });
      var tempObj = JSON.parse(this.JSONString);
      tempObj.components = this.componentsToObj();
      tempObj.wires = this.mapToObj(this.wires);
      tempObj.leds = this.mapToObj(this.leds);
      tempObj.highestId = this.highestId;
      tempObj.highestWireId = this.highestWireId;
      obj = JSON.stringify(tempObj);
      localStorage.setItem("save", obj);
    },
    /**
     * function that adds a component to local storage
     * @param {*} posString : posString of the component
     */
    addComponentToLocal(posString) {
      var jsonObj = JSON.parse(localStorage.getItem("save"));
      var componentObj = JSON.parse(jsonObj.components);
      componentObj[posString] = this.componentToJsonObject(posString);
      jsonObj.components = JSON.stringify(componentObj);
      jsonObj.highestId = this.highestId + 1;
      localStorage.setItem("save", JSON.stringify(jsonObj));
    },
    /**
     * Function that adds a wire to local storage
     * @param {*} wireId : id of the wire
     */
    addWireToLocal(wireId) {
      var jsonObj = JSON.parse(localStorage.getItem("save"));
      var wireObj = JSON.parse(jsonObj.wires);
      wireObj[wireId] = this.wireToJsonObject(wireId);
      jsonObj.wires = JSON.stringify(wireObj);
      jsonObj.highestWireId = this.highestWireId + 1;
      localStorage.setItem("save", JSON.stringify(jsonObj));
    },
    /**
     * Function that removes a component from local storage
     * @param {} posString : posString of the component
     */
    removeComponentFromLocal(posString) {
      var jsonObj = JSON.parse(localStorage.getItem("save"));
      var componentObj = JSON.parse(jsonObj.components);
      delete componentObj[posString];
      jsonObj.components = JSON.stringify(componentObj);

      localStorage.setItem("save", JSON.stringify(jsonObj));
    },
    /**
     * Function that removes a wire from local storage
     * @param {} wire : wireid of the wire
     */
    removeWireFromLocal(wireId) {
      var jsonObj = JSON.parse(localStorage.getItem("save"));
      var wireObj = JSON.parse(jsonObj.wires);
      var wire = wireObj[wireId];
      delete wireObj[wireId];
      jsonObj.wires = JSON.stringify(wireObj);
      var componentObj = JSON.parse(jsonObj.components);
      var componentTo = componentObj[wire.entryTo];
      var componentFrom = componentObj[wire.entryFrom];
      componentTo.inWireIds[componentTo.inWireIds.indexOf(wireId)] = undefined;
      componentFrom.outWireIds.splice(
        componentFrom.outWireIds.indexOf(wireId),
        1
      );
      componentObj[wire.entryTo] = componentTo;
      componentObj[wire.entryFrom] = componentFrom;
      jsonObj.components = JSON.stringify(componentObj);
      localStorage.setItem("save", JSON.stringify(jsonObj));
    },
    /**
     * Function that updates the timing of a clock in local storage
     * @param {} posString : posString of the clock
     * @param {*} newTime : new time of the clock
     */
    updateTime(posString, newTime) {
      var jsonObj = JSON.parse(localStorage.getItem("save"));
      var componentObj = JSON.parse(jsonObj.components);
      if (componentObj[posString].type == "clock") {
        componentObj[posString].timing = newTime;
      } else if (componentObj[posString].type == "input-sequencer") {
        componentObj[posString].values = newTime;
      } else {
        componentObj[posString].delay = newTime;
      }
      jsonObj.components = JSON.stringify(componentObj);
      localStorage.setItem("save", JSON.stringify(jsonObj));
    },
    /**
     * function that updates the location of a component in local storage
     * @param {*} posString: posString of the component to update
     * @param {*} newLocation: new location of the component to update {x,y}
     */
    updateLocation(posString, newLocation) {
      var jsonObj = JSON.parse(localStorage.getItem("save"));
      var componentObj = JSON.parse(jsonObj.components);
      var component = componentObj[posString];
      component.x = newLocation.x;
      component.y = newLocation.y;
      componentObj[`${newLocation.x}-${newLocation.y}`] = component;
      delete componentObj[posString];
      jsonObj.components = JSON.stringify(componentObj);
      localStorage.setItem("save", JSON.stringify(jsonObj));
    },
    /**
     * Function that updates a wire in local storage
     * @param {*} wireId: id of the wire to update
     * @param {*} entry: entry to update the wire with
     * @param {*} from: wether to update the from attributes or the to attributes
     */
    updateWireLocal(wireId, entry, from) {
      var jsonObj = JSON.parse(localStorage.getItem("save"));
      var wireObj = JSON.parse(jsonObj.wires);
      var wire = wireObj[wireId];
      if (from) {
        wire.entryFrom = entry;
      } else {
        wire.entryTo = entry;
      }
      wireObj[wireId] = wire;
      jsonObj.wires = JSON.stringify(wireObj);
      localStorage.setItem("save", JSON.stringify(jsonObj));
    },
    /**
     * function that loads a circuit from local storage
     */
    loadFromLocal() {
      let x = localStorage.getItem("save");
      this.readFromJson(x);
      drawMixin.methods.drawMain.call(this, { x: 0, y: 0 });
    },
    /**
     * Function that saves the circuit to jsonstring attribute of maincanvas
     */
    saveToJson() {
      this.JSONString = JSON.stringify({ version: 1 });
      var tempObj = JSON.parse(this.JSONString);
      tempObj.components = this.componentsToObj();
      tempObj.wires = this.mapToObj(this.wires);
      tempObj.leds = this.mapToObj(this.leds);
      tempObj.highestId = this.highestId;
      tempObj.highestWireId = this.highestWireId;
      this.JSONString = JSON.stringify(tempObj);
    },
    /**
     * Function that loads a circuit from a JSON string
     * @param {string} jsonStr: a json string, standard jsonString attribute from maincanvas
     */
    readFromJson(jsonStr = this.JSONString) {
      store.dispatch("simulationStore/componentStore/clearComponents");
      try {
        var jsonObj = JSON.parse(jsonStr);
        this.leds = new Map();
        this.objToComponents(JSON.parse(jsonObj.components));
        this.objToWires(JSON.parse(jsonObj.wires));
        this.highestId = JSON.parse(jsonObj.highestId);
        this.highestWireId = JSON.parse(jsonObj.highestWireId);
        drawMixin.methods.drawMain.call(this, this.click);
        this.saveToLocal();
        this.switchMode("edit");
        store.commit("canvasStore/emptyCurrent");
      } catch (error) {
        this.openErrorModal("error_failopenfile");
        this.clear(true);
      }
      store.dispatch("canvasStore/clearUndoStack");
      store.dispatch("canvasStore/clearRedoStack");
    },
    /**
     * function that prepares a component for json saving
     * @param {*} posString: posString of the component
     * @returns object with data ready to be saved
     */
    componentToJsonObject(posString) {
      var component = this.components.get(posString);
      if (component.type == "clock") {
        component.timing = store.getters[
          "simulationStore/componentStore/getClockTiming"
        ]({
          id: component.id,
        });
      } else if (component.type == "input-sequencer") {
        component.values = store.getters[
          "simulationStore/componentStore/getInputSequencerValues"
        ]({
          id: component.id,
        });
      } else {
        component.delay = store.getters[
          "simulationStore/componentStore/getComponentDelay"
        ]({
          id: component.id,
        });
      }
      return component;
    },
    /**
     * Function that makes a json string as if the canvas were to be empty
     * @returns json string for empty canvas
     */
    makeEmptyJson() {
      var tempStr = JSON.stringify({ version: 1 });
      var tempObj = JSON.parse(tempStr);
      tempObj.components = "{}";
      tempObj.wires = "{}";
      tempObj.leds = "{}";
      tempObj.highestId = 1;
      tempObj.highestWireId = 1;
      return JSON.stringify(tempObj);
    },
    /**
     * Function that wipes local storage save
     */
    clearJSON() {
      localStorage.setItem("save", this.makeEmptyJson());
    },
    /**
     * Function that prepares a wire object so it can be saved to JSON
     * @param {} wireId: wireId of the wire
     * @returns object ready to be saved
     */
    wireToJsonObject(wireId) {
      var wire = this.wires.get(wireId);
      return wire;
    },
    /*
     * Turn the map<String, Object> to an Object so it can be converted to JSON
     */
    mapToObj(inputMap) {
      let obj = {};
      inputMap.forEach(function (value, key) {
        obj[key] = value;
      });

      return JSON.stringify(obj);
    },
    /**
     * Function that loads a json object into the wires of the circuit
     * @param obj: the json object to be loaded
     */
    /**
     * Function that turns the components map into an object ready to be saved
     * @return: an object ready to be saved
     */
    componentsToObj() {
      let obj = {};
      this.components.forEach(function (value, key) {
        obj[key] = value;
        if (value.type == "clock") {
          obj[key].timing = store.getters[
            "simulationStore/componentStore/getClockTiming"
          ]({
            id: value.id,
          });
        } else if (value.type == "input-sequencer") {
          obj[key].values = store.getters[
            "simulationStore/componentStore/getInputSequencerValues"
          ]({
            id: value.id,
          });
        } else {
          obj[key].delay = store.getters[
            "simulationStore/componentStore/getComponentDelay"
          ]({
            id: value.id,
          });
        }
      });
      return JSON.stringify(obj);
    },
    /**
     * Function that loads components of the circuit from a json object
     * @param {*} obj: object to be loaded into the circuit
     */
    objToComponents(obj) {
      this.components.clear();
      for (let o in obj) {
        editMixin.methods.addComponent.call(
          this,
          { x: obj[o].x, y: obj[o].y },
          obj[o].type,
          obj[o].id,
          true,
          true
        );
        if (obj[o].type === "clock") {
          store.commit("simulationStore/componentStore/setClockTiming", {
            id: parseInt(obj[o].id),
            timing: parseInt(obj[o].timing),
          });
        } else if (obj[o].type == "input-sequencer") {
          store.commit(
            "simulationStore/componentStore/setInputSequencerValues",
            {
              id: parseInt(obj[o].id),
              values: obj[o].values,
            }
          );
        } else {
          store.commit("simulationStore/componentStore/setComponentDelay", {
            id: parseInt(obj[o].id),
            delay: parseInt(obj[o].delay),
          });
        }
      }
    },
    /**
     * Function that loads a json object into the wires of the circuit
     * @param obj: the json object to be loaded
     */
    objToWires(obj) {
      this.wires.clear();
      for (let o in obj) {
        this.addWire(
          obj[o].wireId,
          obj[o].idFrom,
          obj[o].idTo,
          obj[o].entryFrom,
          obj[o].entryTo,
          obj[o].isCustom,
          obj[o].inflPoints,
          obj[o].inTop,
          obj[o].outTop,
          obj[o].path
        );
        for (var i in obj[o].inflPoints) {
          this.checkBounds(i);
        }
      }
    },
    objToMap(obj, map) {
      map.clear();
      for (let o in obj) {
        //otherwise it sets key as string which is not compatible
        map.set(parseInt(o), obj[o]);
      }
    },
  },
};
