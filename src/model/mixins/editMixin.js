import AddComponentAction from "@/model/AddComponentAction";
import RemoveComponentAction from "@/model/RemoveComponentAction";
import AddWireAction from "../AddWireAction.js";
import RemoveWireAction from "../RemoveWireAction.js";

import drawMixin from "@/model/mixins/drawMixin.js";
import store from "../../store/index.js";
import saveMixin from "@/model/mixins/saveMixin.js";
export default {
  methods: {
    /**
     * Function that calls the correct remove function
     * @param {*} pos position of mouse click
     */
    removeObject(pos) {
      if (
        this.components.has(
          `${pos.x - (pos.x % this.canvas.gridInterval)}-${pos.y - (pos.y % this.canvas.gridInterval)
          }`
        )
      ) {
        this.removeComponent(pos);
      } else {
        this.removeWireClick(pos);
      }
    },
    /**
     * function that adds component to the hashmap and model
     * @param {*} pos  position of the component
     * @param {*} type  type of the component
     * @param {*} id id of the component
     * @param {*} addToUndo wether the action has to be added to undoredo
     */
    addComponent(
      pos,
      type,
      id = this.highestId,
      addToUndo = true,
      extra = undefined,
      loadedIn = false
    ) {
      //function that adds a component to components based on click position and current type
      var posString = `${pos.x - (pos.x % this.canvas.gridInterval)}-${pos.y - (pos.y % this.canvas.gridInterval)
        }`;

      pos = {
        x: pos.x - (pos.x % this.canvas.gridInterval),
        y: pos.y - (pos.y % this.canvas.gridInterval),
      };

      if (type != "empty" && !this.components.has(posString)) {
        this.components.set(posString, {
          x: pos.x - (pos.x % this.canvas.gridInterval),
          y: pos.y - (pos.y % this.canvas.gridInterval),
          type: type,
          radius: this.canvas.gridInterval / 2,
          isDragging: false,
          fillStyle: "#000000",
          id: id,
          inWireIds: [undefined, undefined],
          outWireIds: [],
        });
        this.checkBounds(pos);
        if (type == "LED") {
          //add led to array of leds
          this.leds.set(id, {
            id: id,
            x: pos.x - (pos.x % this.canvas.gridInterval),
            y: pos.y - (pos.y % this.canvas.gridInterval),
          });
        }
        if (type == "input-sequencer" && !loadedIn && extra === undefined) {
          this.inputSequencerModal.inputSequencerValues = [
            { timing: 100, value: true },
          ];
          this.inputSequencerModal.displayInputSequencerModal = true;
          this.inputSequencerModal.posString = posString;
        } else if (type == "clock" && !loadedIn && extra === undefined) {
          this.clockModal.prevTiming = 1000;
          this.clockModal.clockPosString = posString;
          this.clockModal.clockId = id;
          this.clockModal.displayClockModal = true;
        } else {
          var timing, values;
          if (extra) {
            timing = extra.timing;
            values = extra.values;
          } else {
            timing = undefined;
            values = undefined;
          }

          // ask for timing of clock component
          store.dispatch(
            "simulationStore/componentStore/addNewComponentOfType",
            {
              id: id,
              type: type,
              timing: timing,
              values: values,
            }
          );
          if (type == "logic-analyser") {
            var laId = this.calcLogicAnalyserId()
            this.components.get(posString).logicAnalyserId = laId;
            store.commit("simulationStore/componentStore/setLogicAnalyserViewId", {
              id: id,
              viewId: laId,
            });
          }
          if (!loadedIn) {
            saveMixin.methods.addComponentToLocal.call(this, posString);
          }

          if (addToUndo) {
            var action = new AddComponentAction(type, id, this, pos, undefined);
            store.commit("canvasStore/pushUndoStack", action);
          }

          this.highestId++;
        }
        this.currTemp.x = undefined;
        this.currTemp.y = undefined;
      }
    },
    /**
     * removes a component from the hashmap and the model
     * @param {*} pos position of the component
     * @param {*} addToUndo wether to add the component to undoredo
     */
    removeComponent(pos, addToUndo = true) {
      //function that removes component at position pos from components
      let roundedPos = {
        x: pos.x - (pos.x % this.canvas.gridInterval),
        y: pos.y - (pos.y % this.canvas.gridInterval),
      };
      let posString = `${roundedPos.x}-${roundedPos.y}`;
      if (
        this.components.has(posString) &&
        !this.components.get(posString).isDragging
      ) {
        var wiresRemoved = 0;
        let inWireCopy = [...this.components.get(posString).inWireIds];
        for (let i of inWireCopy) {
          //delete wires from inWires
          if (this.removeWire(i, addToUndo)) {
            ++wiresRemoved;
          }
        }
        let outWireCopy = [...this.components.get(posString).outWireIds];
        for (let j of outWireCopy) {
          //delete wires from outWires
          if (this.removeWire(j, addToUndo)) {
            ++wiresRemoved;
          }
        }

        var viewcomp = this.components.get(posString);
        var component = store.getters[
          "simulationStore/componentStore/getComponent"
        ]({ id: viewcomp.id });
        if (this.components.get(posString).type == "logic-analyser") {
          this.logicAnalyserIds.splice(this.logicAnalyserIds.indexOf(this.components.get(posString).logicAnalyserId), 1);
        }
        if (addToUndo) {
          var action = new RemoveComponentAction(
            viewcomp.type,
            component.id,
            this,
            pos,
            component.timing
          );
          store.commit("canvasStore/pushUndoStack", action);
          if (wiresRemoved > 0) {
            store.dispatch("canvasStore/batchUndoStack", { amount: wiresRemoved + 1});
          }
        }

        store.commit("simulationStore/componentStore/removeComponent", {
          id: component.id,
        });
        this.components.delete(posString);
        saveMixin.methods.removeComponentFromLocal.call(this, posString);
        this.leds.delete(viewcomp.id);
      } else {
        for (var i of this.wires.values()) {
          // isPointInStroke works on current linewidth
          this.ctxMainCanv.lineWidth = 14;
          if (
            this.ctxMainCanv.isPointInStroke(
              i.path,
              pos.x - this.canvas.xOffset,
              pos.y - this.canvas.yOffset
            )
          ) {
            this.removeWire(i.wireId);
          }
          this.ctxMainCanv.lineWidth = 1;
        }
      }
      drawMixin.methods.drawMain.call(this, this.click);
    },
    /**
     * Removes a wire from the hashmap
     * @param {*} id id of the wire to remove
     */
    removeWireData(id) {
      let wire = this.wires.get(id);
      let componentFrom = this.components.get(wire.entryFrom);
      let componentTo = this.components.get(wire.entryTo);
      saveMixin.methods.removeWireFromLocal.call(this, id);
      componentFrom.outWireIds.splice(componentFrom.outWireIds.indexOf(id), 1);
      componentTo.inWireIds[componentTo.inWireIds.indexOf(id)] = undefined;
      this.wires.delete(id);
      store.dispatch("simulationStore/componentStore/removeWire", { id: id });
    },
    /**
     * Checks if a wire has been clicked to delete
     * @param {*} mousePos position of the mouse
     * @returns true if a wire has been clicked & removed
     */
    removeWireClick(mousePos) {
      for (var i of this.wires.values()) {
        if (this.ctxMainCanv.isPointInPath(i.path, mousePos.x, mousePos.y)) {
          this.removeWire(i.wireId);
          return true;
        }
      }
      return false;
    },
    /**
     * Function that adds a wire to the simulation
     * @param: all params are the params needed for a wire
     * @param addToUndo: wether to add the action to undo
     */
    addWire(
      wireId,
      idFrom,
      idTo,
      entryFrom,
      entryTo,
      isCustom,
      inflPoints,
      inTop,
      outTop,
      path,
      addToUndo = true
    ) {
      this.wires.set(wireId, {
        wireId: wireId,
        entryFrom: entryFrom,
        entryTo: entryTo,
        idFrom: idFrom,
        idTo: idTo,
        inflPoints: inflPoints,
        isCustom: isCustom,
        path: path,
        inTop: inTop,
        outTop: outTop,
        style: "#0000FF",
      });
      if (path === undefined) {
        this.wires.get(wireId).path = this.makePath(
          this.wires.get(wireId).entryFrom,
          this.wires.get(wireId).entryTo,
          this.wires.get(wireId).wireId
        );
      }
      saveMixin.methods.addWireToLocal.call(this, wireId);
      if (inTop) {
        this.components.get(this.wires.get(wireId).entryTo).inWireIds[0] =
          wireId;
      } else {
        this.components.get(this.wires.get(wireId).entryTo).inWireIds[1] =
          wireId;
      }

      this.components
        .get(this.wires.get(wireId).entryFrom)
        .outWireIds.push(wireId);

      // seperate case for components with a single input
      var numInput = +!inTop;
      var numOutput = 0;
      if (
        this.componentArrays.singleInputs.indexOf(
          this.components.get(this.wires.get(wireId).entryTo).type
        ) !== -1
      ) {
        numInput = 0;
      }
      if (
        this.componentArrays.multipleOutputs.indexOf(
          this.components.get(this.wires.get(wireId).entryFrom).type
        ) !== -1
      ) {
        numOutput = +!outTop;
      }
      store.dispatch("simulationStore/componentStore/addWire", {
        id: wireId,
        numInput: numInput,
        numOutput: numOutput,
        inputId: this.wires.get(wireId).idFrom,
        outputId: this.wires.get(wireId).idTo,
      });
      if (addToUndo) {
        var action = new AddWireAction(
          wireId,
          idFrom,
          idTo,
          entryFrom,
          entryTo,
          isCustom,
          inflPoints,
          +inTop,
          +outTop,
          path,
          this
        );
        store.commit("canvasStore/pushUndoStack", action);
      }
    },
    calcLogicAnalyserId() {
      if (this.logicAnalyserIds.length == 0) {
        this.logicAnalyserIds.push(1);
        return 1;
      }
      var prev = 1;
      for (var i of this.logicAnalyserIds) {
        if (i > prev) {
          break;
        }
        prev++;
      }
      this.logicAnalyserIds.push(prev);
      this.logicAnalyserIds.sort();
      return prev;
    },
    /**
       * Function that removes a wire
       * @param id: the if of the wire
       * @param addToUndo: wether or not to add the action to undo
       */
    removeWireCaller(id, addToUndo = true) {
      var wire = this.wires.get(id);
      if (wire == undefined) {
        return false;
      }
      if (addToUndo) {
        var action = new RemoveWireAction(
          id,
          wire.idFrom,
          wire.idTo,
          wire.entryFrom,
          wire.entryTo,
          wire.isCustom,
          wire.inflPoints,
          wire.inTop,
          wire.outTop,
          wire.path,
          this
        );
        store.commit("canvasStore/pushUndoStack", action);
      }
      this.intersectionChecker.removeWire(id);
      this.removeWireData(id);

      return true;
    },
    /**
    * Function that adds an inflection point the the wire that is currently being connected
    * @param pos: position of the inflection point
    */
    addInflectionPoint(pos) {
      this.wires.get(this.highestWireId).isCustom = true;
      this.wires.get(this.highestWireId).inflPoints.push({
        x:
          pos.x -
          (pos.x % (this.canvas.gridInterval / (this.canvas.gridInterval / 5))),
        y:
          pos.y -
          (pos.y % (this.canvas.gridInterval / (this.canvas.gridInterval / 5))),
      });
      this.checkBounds(pos);
      this.wires.get(this.highestWireId).path = this.makeCustomPrevPath(
        this.wires.get(this.highestWireId)
      );
    },
  },
};
