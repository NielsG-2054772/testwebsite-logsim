import store from "../../store/index.js";
import drawMixin from "@/model/mixins/drawMixin.js";
import editMixin from "@/model/mixins/editMixin.js";
import MoveComponentAction from "@/model/MoveComponentAction";
export default {
  methods: {
    /**
     * When the user clicks in the wiring 1 state, checks if there is a component on pos and starts a wire from here if there is a component
     * @param pos: the position of the click
     */
    wiring1Clicked(pos) {
      let posString = `${pos.x - (pos.x % this.canvas.gridInterval)}-${
        pos.y - (pos.y % this.canvas.gridInterval)
      }`;
      if (
        this.components.has(posString) &&
        this.components.get(posString).type != "LED"
      ) {
        this.wires.set(this.highestWireId, {
          wireId: this.highestWireId,
          entryFrom: posString,
          idFrom: this.components.get(posString).id,
          outTop: this.calcHalf(pos),
          path: 0,
          inflPoints: [],
          isCustom: false,
        });
        return true;
      } else if (
        this.components.has(posString) &&
        this.components.get(posString).type == "LED"
      ) {
        this.openErrorModal("error_nooutputs");
      }
      return false;
    },
    /**
     * When the user clicks in the wiring 2 state, checks if there is a component on pos and wires to the component if there was one, otherwise it will add an inflection point
     * @param pos: the position of the click
     */
    wiring2Clicked(pos) {
      let posString = `${pos.x - (pos.x % this.canvas.gridInterval)}-${
        pos.y - (pos.y % this.canvas.gridInterval)
      }`;
      //if there is no component -> add inflection point to current wire
      if (!this.components.has(posString)) {
        this.addInflectionPoint(pos);
      } else if (this.checkComponentTypeWiring(posString, this.calcHalf(pos))) {
        //if a component is clicked and there is an input for it
        this.addWire(
          this.highestWireId,
          this.wires.get(this.highestWireId).idFrom,
          this.components.get(posString).id,
          this.wires.get(this.highestWireId).entryFrom,
          posString,
          this.wires.get(this.highestWireId).isCustom,
          this.wires.get(this.highestWireId).inflPoints,
          this.calcHalf(pos),
          this.wires.get(this.highestWireId).outTop,
          this.wires.get(this.highestWireId).outTop
        );

        this.highestWireId++;
        this.$store.commit("canvasStore/setCurrent", "wiring1");
      } else if (
        this.components.get(posString).type == "pin" ||
        this.components.get(posString).type == "input-sequencer" ||
        this.components.get(posString).type == "clock"
      ) {
        this.openErrorModal("error_noinputs");
      } else {
        this.wires.delete(this.highestWireId);
        this.$store.commit("canvasStore/setCurrent", "wiring1");
        this.openErrorModal("error_noinputsleft");
      }
      this.update();
    },
    /**
     * Function that calculates wether a position is in the top half of a part of the grid or in the bottom half
     * @param pos: the position to check
     * @return: 1 if the position is in the top half otherwise 0
     */
    calcHalf(pos) {
      var roundedPos = pos.y - (pos.y % (this.canvas.gridInterval / 2));
      if (roundedPos % this.canvas.gridInterval == 0) {
        return 1;
      }
      return 0;
    },
    testFunction() {
      return "clicked return";
    },
    /**
     * Function that checks if a component is allowed to have a new wire
     * @param posString: location of component
     * @param halfClicked: which half was clicked
     * @return true if the component is allowed to have a new wire otherwise false
     */
    checkComponentTypeWiring(posString, halfClicked) {
      if (this.components.has(posString)) {
        var component = this.components.get(posString);
      } else {
        return false;
      }

      if (
        this.componentArrays.singleInputs.indexOf(component.type) == -1 &&
        this.componentArrays.noInputs.indexOf(component.type) == -1
      ) {
        if (halfClicked) {
          return component.inWireIds[0] == undefined;
        } else {
          return component.inWireIds[1] == undefined;
        }
      } else {
        return (
          ((this.componentArrays.singleInputs.indexOf(component.type) != -1 &&
            component.inWireIds[0] == undefined &&
            component.inWireIds[1] == undefined) ||
            (this.componentArrays.noInputs.indexOf(component.type) == -1 &&
              this.componentArrays.singleInputs.indexOf(component.type) ==
                -1)) &&
          this.componentArrays.noInputs.indexOf(component.type) == -1
        );
      }
    },

    /**
     * Function that is called when the canvas is clicked and the state is empty, it will start to drag a new component or it wil drag a selected component to its new location
     * @param pos: the position of the click
     */
    emptyClicked(pos) {
      //function to call when no new component is selected but canvas is clicked
      let roundedPos = this.roundPos(pos);
      let posString = `${roundedPos.x}-${roundedPos.y}`;
      // there is a component in this spot and no component is being dragged
      if (this.components.has(posString) && !this.currentDragging) {
        let component = this.components.get(posString);
        this.currentDragging = true;
        this.currentDraggingComponent = component;
        component.isDragging = true;
        component.fillStyle = "#0000FF";

        component.oldPos = {
          x: component.x,
          y: component.y,
        };
      } else if (!this.components.has(posString) && this.currentDragging) {
        //move component to new location
        let component = this.currentDraggingComponent;
        this.currentDraggingComponent = 0;
        component.isDragging = false;
        this.currentDragging = false;
        component.fillStyle = "#000000";
        this.checkBounds(pos);
        this.changeKey(posString, `${component.x}-${component.y}`);
        if (component.type == "LED") {
          this.leds.get(component.id).x = roundedPos.x;
          this.leds.get(component.id).y = roundedPos.y;
        }
        var oldPos = { x: component.oldPos.x, y: component.oldPos.y };
        var action = new MoveComponentAction(
          component.id,
          oldPos,
          { x: component.x, y: component.y },
          this
        );
        store.commit("canvasStore/pushUndoStack", action);
      } else if (
        this.components.has(posString) &&
        this.components.get(posString) === this.currentDraggingComponent
      ) {
        let component = this.currentDraggingComponent;
        this.currentDraggingComponent = 0;
        component.isDragging = false;
        this.currentDragging = false;
        component.fillStyle = "#000000";
        store.commit("canvasStore/emptyCurrent");
      }
    },
    removeWireClick(mousePos) {
      if (editMixin.methods.removeWire.call(this, mousePos)) {
        drawMixin.methods.drawMain.call(this, this.click);
      }
    },
    leftClickFunction(evt) {
      var mousePos = this.getMousePos(this.mainCanv, evt);
      // can only change pin values in run mode
      if (this.mode == "run") {
        let roundedPos = this.roundPos(mousePos);

        let posString = `${roundedPos.x}-${roundedPos.y}`;

        if (this.components.has(posString)) {
          let component = this.components.get(posString);
          if (component.type == "pin") {
            store.dispatch("simulationStore/componentStore/togglePinValue", {
              id: component.id,
            });
            store.dispatch("simulationStore/addComponentToEvaluate", {
              id: component.id,
            });
            this.drawComponent(component, "pin");
          }
        }
        return;
      } else if (this.mode == "stepper") {
        let roundedPos = this.roundPos(mousePos);
        let posString = `${roundedPos.x}-${roundedPos.y}`;
        if (this.components.has(posString)) {
          let component = this.components.get(posString);
          if (component.type == "pin") {
            store.dispatch("simulationStore/componentStore/togglePinValue", {
              id: component.id,
            });
            store.dispatch("simulationStore/addComponentToEvaluate", {
              id: component.id,
              startSimulation: this.mode !== "stepper",
            });
            this.drawComponent(component, "pin");
          }
        }
        return;
      }
      if (this.getCurrentComponent == "deleting") {
        this.removeComponent(mousePos);
        store.commit("canvasStore/emptyCurrent");
      } else if (this.getCurrentComponent == "wiring1") {
        if (this.wiring1Clicked(mousePos)) {
          this.$store.commit("canvasStore/setCurrent", "wiring2");
        }
      } else if (this.getCurrentComponent == "wiring2") {
        this.wiring2Clicked(mousePos);
      } else if (this.getCurrentComponent != "empty") {
        this.addComponent(mousePos, this.getCurrentComponent);
        store.commit("canvasStore/emptyCurrent");
      } else {
        this.emptyClicked(mousePos);
      }
      drawMixin.methods.drawMain.call(this, mousePos);
    },
    rightClickFunction(ev) {
      if (this.mode !== "edit") {
        return;
      }
      var mousePos = this.getMousePos(this.mainCanv, ev);
      let roundedPos = this.roundPos(mousePos);
      if (
        !this.currentDragging &&
        this.components.has(`${roundedPos.x}-${roundedPos.y}`)
      ) {
        let type = this.components.get(`${roundedPos.x}-${roundedPos.y}`).type;
        if (
          type != "pin" &&
          type != "logic-analyser" &&
          type != "clock" &&
          type != "LED" &&
          type != "input-sequencer"
        ) {
          this.currentDraggingComponent = this.components.get(
            `${roundedPos.x}-${roundedPos.y}`
          );
          this.delayModal.prevDelay = store.getters[
            "simulationStore/componentStore/getComponentDelay"
          ]({
            id: this.currentDraggingComponent.id,
          }); //update value for delaymodal so the user sees the current delay
          this.delayModal.displayDelayModal = true;
        } else if (type == "clock") {
          var component = this.components.get(
            `${roundedPos.x}-${roundedPos.y}`
          );
          // this.clockModal.prevTiming
          var timing = store.getters[
            "simulationStore/componentStore/getClockTiming"
          ]({
            id: component.id,
          });
          this.clockModal.clockPosString = `${roundedPos.x}-${roundedPos.y}`;
          this.clockModal.prevTiming = timing;
          this.clockModal.clockId = component.id;
          this.clockModal.displayClockModal = true;
        } else if (type == "input-sequencer") {
          var comp = this.components.get(`${roundedPos.x}-${roundedPos.y}`);
          var values = store.getters[
            "simulationStore/componentStore/getInputSequencerValues"
          ]({
            id: comp.id,
          });
          this.inputSequencerModal.posString = `${roundedPos.x}-${roundedPos.y}`;
          this.inputSequencerModal.inputSequencerValues = values;
          this.inputSequencerModal.inputSequencerId = comp.id;
          this.inputSequencerModal.displayInputSequencerModal = true;
        }
      }
    },
    keyClickFunction(event) {
      // const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
      if (!this.isModalOpen && !event.repeat) {
        event.preventDefault();
        switch (event.key) {
          case "ArrowLeft":
            if (this.canvas.xOffset > 0) {
              // if not at left edge
              this.canvas.xOffset -= this.canvas.gridInterval;
              // this.drawMain({ x: this.click.x, y: this.click.y });
              drawMixin.methods.drawMain.call(this, {
                x: this.click.x,
                y: this.click.y,
              });
            }
            break;
          case "ArrowRight":
            this.canvas.xOffset += this.canvas.gridInterval;
            // this.drawMain({ x: this.click.x, y: this.click.y });
            drawMixin.methods.drawMain.call(this, {
              x: this.click.x,
              y: this.click.y,
            });
            break;
          case "ArrowUp":
            if (this.canvas.yOffset > 0) {
              // if not at top edge
              this.canvas.yOffset -= this.canvas.gridInterval;
              // this.drawMain({ x: this.click.x, y: this.click.y });
              drawMixin.methods.drawMain.call(this, {
                x: this.click.x,
                y: this.click.y,
              });
            }
            break;
          case "ArrowDown":
            this.canvas.yOffset += this.canvas.gridInterval;
            // this.drawMain({ x: this.click.x, y: this.click.y });
            drawMixin.methods.drawMain.call(this, {
              x: this.click.x,
              y: this.click.y,
            });
            break;
          case "w":
            this.zoomin(event);
            break;
          case "s":
            if (event.ctrlKey && this.mode === "edit") {
              this.displaySaveModal = true;
            } else {
              this.zoomout(event);
            }
            break;
          case "r":
            if (this.mode === "edit") {
              this.$store.commit("canvasStore/setCurrent", "deleting");
            }
            break;
          case "f":
            if (this.mode === "edit") {
              this.$store.commit("canvasStore/setCurrent", "wiring1");
            }
            break;
          case "Escape":
            this.resetCurrent();
            break;
          case "z":
            if (event.ctrlKey && this.mode === "edit") {
              this.undo();
            }
            break;
          case "y":
            if (event.ctrlKey && this.mode === "edit") {
              this.redo();
            }
            break;
        }
      }
    },
    mouseMoveFunction(evt) {
      if (
        this.currentDragging ||
        (this.getCurrentComponent != "empty" &&
          this.getCurrentComponent != "wiring1" &&
          this.getCurrentComponent != "wiring2")
      ) {
        var mousePos = this.getMousePos(this.mainCanv, evt);
        if (this.mode == "edit") {
          // this.drawTemp(mousePos);
          drawMixin.methods.drawTemp.call(this, mousePos);
        }
      }
    },
  },
};
