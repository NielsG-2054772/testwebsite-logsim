<template>
  <img
    alt="and-gate"
    id="and-gate"
    style="display: none"
    src="../assets/images/logic-gate-and-svgrepo-com.png"
    width="300"
    height="300"
  />
  <img
    alt="nand-gate"
    id="nand-gate"
    style="display: none"
    src="../assets/images/logic-gate-nand.png"
    width="300"
    height="300"
  />
  <img
    alt="or-gate"
    id="or-gate"
    style="display: none"
    src="../assets/images/logic-gate-or-svgrepo-com.png"
    width="300"
    height="300"
  />
  <img
    alt="nor-gate"
    id="nor-gate"
    style="display: none"
    src="../assets/images/logic-gate-nor.png"
    width="300"
    height="300"
  />
  <img
    alt="xor-gate"
    id="xor-gate"
    style="display: none"
    src="../assets/images/logic-gate-xor-svgrepo-com.png"
    width="300"
    height="300"
  />
  <img
    alt="not-gate"
    id="not-gate"
    style="display: none"
    src="../assets/images/logic-gate-not-svgrepo-com.png"
    width="300"
    height="300"
  />
  <img
    alt="xnor-gate"
    id="xnor-gate"
    style="display: none"
    src="../assets/images/logic-gate-nxor-svgrepo-com.png"
    width="300"
    height="300"
  />
  <img
    alt="d-flipflop"
    id="d-flipflop"
    style="display: none"
    src="../assets/images/D-Type_Flip-flop.png"
    width="300"
    height="300"
  />
  <img
    alt="sr-latch"
    id="sr-latch"
    style="display: none"
    src="../assets/images/sr-latch.png"
    width="300"
    height="300"
  />
  <img
    alt="pin"
    id="pinUndefined"
    style="display: none"
    src="../assets/images/input_undefined.png"
    width="300"
    height="300"
  />
  <img
    alt="pin"
    id="pinTrue"
    style="display: none"
    src="../assets/images/input_true.png"
    width="300"
    height="300"
  />
  <img
    alt="pin"
    id="pinFalse"
    style="display: none"
    src="../assets/images/input_false.png"
    width="300"
    height="300"
  />
  <img
    alt="clock"
    id="clock"
    style="display: none"
    src="../assets/images/clock.png"
    width="300"
    height="300"
  />
  <img
    alt="logic-analyser"
    id="logic-analyser"
    style="display: none"
    src="../assets/images/logic-analyzer.png"
    width="300"
    height="300"
  />

  <img
    alt="input-sequencer"
    id="input-sequencer"
    style="display: none"
    src="../assets/images/input_sequencer.png"
    width="300"
    height="300"
  />

  <img
    alt="led-on"
    id="led-on"
    style="display: none"
    src="../assets/images/led-on.png"
    width="300"
    height="300"
  />
  <img
    alt="led-off"
    id="led-off"
    style="display: none"
    src="../assets/images/led-off.png"
    width="300"
    height="300"
  />

  <canvas
    id="mainCanv"
    tabindex="1"
    class="w-100 h-100"
    :height="canvas.canvHeight"
    :width="canvas.canvWidth"
  ></canvas>
  <!-- <a href="#" @click="setLanguages('nl')">Nederlands</a>
    <a href="#" @click="setLanguages('eng')">English</a> -->
  <!-- <h1 id="title">
      Deze tekst ziet ge alleen als er nog geen taal gekozen is
    </h1> -->
  <!-- <h3 id="state">State: {{ getCurrentComponent }}</h3> -->
  <!-- <h1>
      X: {{ click.x / zoom.scaleFactor }} Y:{{ click.y / zoom.scaleFactor }}
    </h1>
    <h2 id="debug">
      offsets: {{ canvas.xOffset }}, {{ canvas.yOffset }} interval:
      {{ canvas.gridInterval }}, scale: {{ zoom.scaleFactor }}
    </h2>
    
    <h3 id="dragging state">Draggingstate {{ currentDragging }}</h3> -->

  <!-- <button @click="zoomin">zoom in</button>
  <button @click="zoomout">zoom out</button> -->
  <InputSequencerModal
    class="translatableModals"
    v-if="this.inputSequencerModal.displayInputSequencerModal"
    @input-sequencer-values-event="setInputSequencerValues"
    :posString="this.inputSequencerModal.posString"
    :prevValues="this.inputSequencerModal.inputSequencerValues"
    :prevInputSequencerId="this.inputSequencerModal.inputSequencerId"
    ref="inputSequencerModal"
  />
  <DelayModal
    class="translatableModals"
    v-if="this.delayModal.displayDelayModal"
    @component-delay-set-event="setDelayValue"
    :prevDelay="this.delayModal.prevDelay"
  />
  <ClockModal
    v-if="this.clockModal.displayClockModal"
    @component-timing-set-event="setTimingValue"
    @close-modal-event="hideClockModal"
    :prevTiming="this.clockModal.prevTiming"
    :propClockId="this.clockModal.clockId"
    :posString="this.clockModal.clockPosString"
    ref="clockModal"
  />
  <logicAnalyzerChartModal
    ref="analyzerModal"
    @toggleAnalyzerModal-event="toggleAnalyzerModal"
  />
  <image-modal
    v-if="this.displayImageModal"
    @close-image-modal-event="hideImageModal"
    @save-image-event="saveImage"
    @refresh-image-event="refreshImage"
    @save-multiple-image-event="makeQuarterspictures"
    ref="imageModal"
  />
  <ErrorModal
    v-if="this.errorModal.displayErrorModal"
    @close-error-modal-event="hideErrorModal"
    @refresh-error-modal-event="refreshErrorMsg"
    ref="errorModal"
  />
  <SaveModal
    v-if="this.displaySaveModal"
    @close-save-modal-event="hideSaveModal"
    @save-JSON-event="downloadJson"
    ref="saveModal"
  />
  <LoadModal
    v-if="this.displayLoadModal"
    @close-load-modal-event="hideLoadModal"
    @load-JSON-event="uploadJson"
    ref="loadModal"
  />
  <NewModal
    v-if="this.displayNewModal"
    @reset-close-event="resetCanvas"
    @close-modal-event="hideNewModal"
    @save-event="openSaveModal"
  />
</template>
<script>
import store from "../store/index.js";
import InputSequencerModal from "../components/InputSequencerModal.vue";
// import logicanalyzer from "../components/logicAnalyzerModal.vue"
import AddComponentAction from "@/model/AddComponentAction";
// import RemoveComponentAction from "@/model/RemoveComponentAction";
import ImageModal from "../components/imageModal.vue";
import DelayModal from "../components/DelayModal.vue";
import ClockModal from "../components/ClockModal.vue";
import NewModal from "../components/newModal.vue";
import logicAnalyzerChartModal from "../components/logicAnalyzerModal.vue";
import ErrorModal from "../components/ErrorModal.vue";
import LoadModal from "../components/loadModal.vue";
import SaveModal from "../components/saveModal.vue";
import testMixin from "@/model/mixins/testMixin.js";
import pathMixin from "@/model/mixins/pathMixin.js";
import drawMixin from "@/model/mixins/drawMixin.js";
import editMixin from "@/model/mixins/editMixin.js";
import saveMixin from "@/model/mixins/saveMixin.js";
import clickMixin from "@/model/mixins/clickMixin.js";
// import MoveComponentAction from "@/model/MoveComponentAction";
// import RemoveWireAction from "@/model/RemoveWireAction";
// import AddWireAction from "@/model/AddWireAction";
import IntersectionChecker from "@/model/IntersectionChecker";
export default {
  name: "MainCanvas",
  mixins: [testMixin, pathMixin, drawMixin, editMixin, saveMixin, clickMixin],
  props: {
    msg: String,
  },
  components: {
    InputSequencerModal,
    DelayModal,
    logicAnalyzerChartModal,
    ImageModal,
    ErrorModal,
    SaveModal,
    LoadModal,
    ClockModal,
    NewModal,
  },
  data() {
    return {
      greeting: "Hello World!",
      mode: "edit",
      click: {
        x: 0,
        y: 0,
      },
      canvas: {
        xMin: Infinity,
        xMax: 0,
        yMin: Infinity,
        yMax: 0,
        mainCanv: 0,
        xOffset: 60,
        yOffset: 60,
        prevXOffset: 0,
        prevYOffset: 0,
        gridInterval: 60,
        canvHeight: 0.9 * window.innerHeight,
        canvWidth: window.innerWidth - 200,
        wirePath: 0,
        canvasEnabled: false,
      },
      inputSequencerModal: {
        displayInputSequencerModal: false,
        inputSequencerValues: [{ timing: 100, value: true }],
        posString: "",
        inputSequencerId: 0,
      },
      logicAnalyserIds: [],
      scale: {
        scaleX: 1,
        scaleY: 1,
        scaleFactor: 1,
        prevScaleFactor: 1,
      },
      zoom: {
        scaleFactor: 1,
      },
      currentDragging: false,
      currentDraggingComponent: 0,
      currentComp: store.getters["canvasStore/getCurrent"],
      ctxMainCanv: 0,
      mainCanv: 0,
      leds: new Map(),
      components: new Map(),
      wires: new Map(),
      currLanguage: "eng",
      highestId: 1,
      highestWireId: 1,
      intersectionChecker: 0,
      currTemp: {
        x: 0,
        y: 0,
        mode: "edit",
      },

      delayModal: {
        displayDelayModal: false,
        prevDelay: 100,
      },
      clockModal: {
        displayClockModal: false,
        prevTiming: 100,
        clockId: 0,
        clockPosString: "",
      },
      displayNewModal: false,
      displayLogicAnalyzerChartModal: false,
      displayImageModal: false,
      errorModal: {
        displayErrorModal: false,
        errorMsg: "No errors yet! (how did you get here)",
      },
      displayLoadModal: false,
      displaySaveModal: false,
      JSONString: JSON.stringify({
        version: 1,
        components: "{}",
        wires: "{}",
        leds: "{}",
        highestId: 1,
        highestWireId: 1,
      }),
      componentArrays: {
        noDelays: ["logic-analyser", "input-sequencer", "LED", "pin"],
        currentAllowed: ["wiring1", "wiring2", "deleting", "empty"],
        singleInputs: ["not-gate", "LED", "logic-analyser"],
        multipleOutputs: ["d-flipflop", "sr-latch"],
        noInputs: ["clock", "input-sequencer", "pin"],
      },
    };
  },
  methods: {
    /**
     * Function that moves a componet
     * @param pos:original position of component (object with x and y)
     * @param newPos: new position of component (object with x and y)
     */
    moveComponent(pos, newpos) {
      let posString = `${pos.x}-${pos.y}`;
      var component = this.components.get(posString);
      if (component !== undefined) {
        this.changeKey(`${newpos.x}-${newpos.y}`, posString);
        this.checkBounds(newpos);
        if (component.type == "LED") {
          this.leds.get(component.id).x = newpos.x;
          this.leds.get(component.id).y = newpos.y;
        }
        drawMixin.methods.drawMain.call(this, this.click);
      }
    },
    /**
     * Function that clears all data
     * @param clearLocal: wether to clear the local storage or not
     */
    clear(clearLocal) {
      store.dispatch("simulationStore/componentStore/clearComponents");
      this.components = new Map();
      this.wires = new Map();
      this.leds = new Map();
      this.highestWireId = 1;
      this.highestComponentId = 1;
      this.click = { x: 0, y: 0 };
      this.currentDragging = false;
      this.currentDraggingComponent = 0;
      this.intersectionChecker = new IntersectionChecker();
      this.canvas.xMin = Infinity;
      this.canvas.yMin = Infinity;
      this.canvas.xMax = 0;
      this.canvas.yMax = 0;
      this.logicAnalyserIds = [];
      drawMixin.methods.drawMain.call(this, this.click);
      if (clearLocal) saveMixin.methods.clearJSON.call(this);
      this.switchMode("edit");
      store.dispatch("canvasStore/clearUndoStack");
      store.dispatch("canvasStore/clearRedoStack");
    },
    /**
     * TODO: comment
     */
    undo() {
      var action = store.getters["canvasStore/popUndoStack"];
      if (action !== undefined) {
        var redoAction;
        if (Array.isArray(action)) {
          redoAction = [];
          action.forEach(function (action1) {
            action1.getReverse().execute();

            redoAction.push(action1.getReverse());
          });
        } else {
          action.getReverse().execute();
          redoAction = action.getReverse();
        }

        store.commit("canvasStore/pushRedoStack", redoAction);
        setTimeout(() => {
          drawMixin.methods.drawMain.call(this, this.click);
        }, 10);
      }
    },
    /**
     * TODO: comment
     */
    redo() {
      var action = store.getters["canvasStore/popRedoStack"];
      if (action !== undefined) {
        var undoAction;
        if (Array.isArray(action)) {
          undoAction = [];
          action.forEach(function (action1) {
            action1.getReverse().execute();

            undoAction.push(action1.getReverse());
          });
        } else {
          action.getReverse().execute();
          undoAction = action.getReverse();
        }

        store.commit("canvasStore/pushUndoStack", undoAction);
        setTimeout(() => {
          drawMixin.methods.drawMain.call(this, this.click);
        }, 10);
      }
    },
    /**
     * Function that returns the current mode
     */
    getMode() {
      return this.mode;
    },
    /**
     * TODO: comment
     */
    nextStep() {
      store.dispatch("simulationStore/nextStep");
    },
    resetCanvas() {
      this.displayNewModal = false;
      this.clear(true);
    },
    showNewModal() {
      this.displayNewModal = true;
    },
    hideNewModal() {
      this.displayNewModal = false;
    },
    openSaveModal() {
      this.displaySaveModal = true;
    },
    /**
     * Function that hides the modal for the inputsequencer
     */
    hideInputSequencerModal() {
      this.inputSequencerModal.displayInputSequencerModal = false;
    },
    /**
     * Function that hides the modal for saving
     */
    hideSaveModal() {
      this.displaySaveModal = false;
    },
    /**
     * Function that hides the modal for component delay
     */
    hideDelayModal() {
      this.delayModal.displayDelayModal = false;
    },
    /**
     * Function that hides the modal for the clock timing
     */
    hideClockModal() {
      this.clockModal.displayClockModal = false;
    },
    /**
     * Function that hides the modal for the image maker
     */
    hideImageModal() {
      this.displayImageModal = false;
    },
    /**
     * Function that hides the modal for the error warnings
     */
    hideErrorModal() {
      this.errorModal.displayErrorModal = false;
    },
    /**
     * Function that hides the modal for the filel loading
     */
    hideLoadModal() {
      this.displayLoadModal = false;
    },
    /**
     * Function that opens the modal for error messages with a given message
     * @param msg: The message to display to the user
     */
    openErrorModal(msg) {
      this.errorModal.displayErrorModal = true;
      let langObj = null;
      let lang = store.getters["canvasStore/getCurrLanguage"];
      try {
        const file = require("../assets/languages/" + lang + ".json");
        langObj = JSON.parse(JSON.stringify(file));
      } catch (e) {
        console.log("error loading language file");
      } finally {
        this.errorModal.errorMsg = langObj[msg];
      }
    },
    /**
     * Function that passes the error message to the modal
     */
    refreshErrorMsg() {
      this.$refs.errorModal.setErrorMsg(this.errorModal.errorMsg);
    },
    /**
     * Function to open the image maker modal
     */
    openImageModal() {
      this.displayImageModal = true;
    },
    /**
     * Function that toggles the logic analyzer modal, it does not actually open and close. It toggles between being visible and hidden
     */
    toggleAnalyzerModal() {
      if (this.displayLogicAnalyzerChartModal) {
        this.$refs.analyzerModal.closeModal();
        this.displayLogicAnalyzerChartModal = false;
      } else {
        this.$refs.analyzerModal.openModal();
        this.displayLogicAnalyzerChartModal = true;
      }
    },
    /**
     * Funtion that saves image to users file system
     * @param imgName: name of the image
     */
    saveQuarterImages(imgName) {
      var canvasElement = this.mainCanv;
      var MIME_TYPE = "image/png";
      var imgURL = canvasElement.toDataURL(MIME_TYPE);
      var dlLink = document.createElement("a");
      dlLink.download = imgName;
      dlLink.href = imgURL;
      dlLink.dataset.downloadurl = [
        MIME_TYPE,
        dlLink.download,
        dlLink.href,
      ].join(":");
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
    },
    /**
     * Function that prepares the canvas for makeQuarterspictures, it calculates the zoom needed for rowCols^2 pictures
     */
    prepareQuarter() {
      let intervalsX = 15;
      this.ctxMainCanv.save();
      this.ctxMainCanv.setTransform(1, 0, 0, 1, 0, 0);
      this.canvas.scaleFactor = 1;
      drawMixin.methods.drawMain.call(this, this.click);
      this.canvas.prevXOffset = this.canvas.xOffset;
      this.canvas.prevYOffset = this.canvas.yOffset;
      this.canvas.xOffset = this.canvas.xMin - this.canvas.gridInterval;
      this.canvas.yOffset = this.canvas.yMin - this.canvas.gridInterval;
      let zoomSize =
        this.canvas.canvWidth / (intervalsX * this.canvas.gridInterval);
      this.ctxMainCanv.scale(zoomSize, zoomSize);
      this.zoom.prevScaleFactor = this.zoom.scaleFactor;
      this.zoom.scaleFactor = zoomSize;
    },
    /**
     * Function that calculates in how many rows and columns the canvas has to be divided to make a clear picture and then makes these pictures and saves them
     */
    makeQuarterspictures(fileName) {
      if(this.components.size === 0){
        this.saveImage(fileName);
        return;
      }
      let intervalsX = 15;
      let intervalsY = Math.ceil(
        intervalsX * (this.canvas.canvHeight / this.canvas.canvWidth)
      );
      let rowColsX = Math.ceil(
        (this.canvas.xMax + this.canvas.gridInterval - this.canvas.xMin) /
          (this.canvas.gridInterval * intervalsX)
      );
      let rowColsY = Math.ceil(
        (this.canvas.yMax + this.canvas.gridInterval - this.canvas.yMin) /
          (this.canvas.gridInterval * intervalsY)
      );
      let rowCols = Math.max(rowColsX, rowColsY);
      this.prepareQuarter();
    
      for (let i = 0; i < rowCols; i++) {
        for (let j = 0; j < rowCols; j++) {
          this.canvas.xOffset =
            this.canvas.xMin -
            this.canvas.gridInterval +
            i * intervalsX * this.canvas.gridInterval;
          this.canvas.yOffset =
            this.canvas.yMin + j * (intervalsY) * this.canvas.gridInterval;
          

          drawMixin.methods.drawMain.call(this, this.click);
          this.saveQuarterImages(`${fileName} ${i + 1}-${j + 1} `);
        }
      }
      this.restoreCanvas();
    },
    /**
     * Function that changes the canvas so that all components and wires are visible
     */
    setAllVisible() {
      this.ctxMainCanv.save();
      this.ctxMainCanv.setTransform(1, 0, 0, 1, 0, 0);
      this.canvas.scaleFactor = 1;
      drawMixin.methods.drawMain.call(this, this.click);
      this.canvas.prevXOffset = this.canvas.xOffset;
      this.canvas.prevYOffset = this.canvas.yOffset;
      this.canvas.xOffset = this.canvas.xMin - this.canvas.gridInterval;
      this.canvas.yOffset = this.canvas.yMin - this.canvas.gridInterval;
      let zoomX =
        this.canvas.canvWidth /
        (this.canvas.xMax - this.canvas.xMin + this.canvas.gridInterval * 3);
      let zoomY =
        this.canvas.canvHeight /
        (this.canvas.yMax - this.canvas.yMin + this.canvas.gridInterval * 3);
      let zoomSize = Math.min(zoomX, zoomY);
      if (zoomSize < 0) {
        zoomSize = this.canvas.scaleFactor;
      }
      this.ctxMainCanv.scale(zoomSize, zoomSize);
      this.zoom.prevScaleFactor = this.zoom.scaleFactor;
      this.zoom.scaleFactor = zoomSize;
      drawMixin.methods.drawMain.call(this, this.click);
    },
    /**
     * Function that restores the canvas to where it was at te start of setAllvisible
     */
    restoreCanvas() {
      this.ctxMainCanv.restore();
      this.canvas.xOffset = this.canvas.prevXOffset;
      this.canvas.yOffset = this.canvas.prevYOffset;
      this.zoom.scaleFactor = this.zoom.prevScaleFactor;
      drawMixin.methods.drawMain.call(this, this.click);
    },
    /**
     * Function that sets picture in imagemodal
     */
    refreshImage() {
      this.setAllVisible();
      var canvasElement = this.mainCanv;
      var MIME_TYPE = "image/png";
      var imgURL = canvasElement.toDataURL(MIME_TYPE);
      this.$refs.imageModal.setPicture(imgURL);
      this.restoreCanvas();
    },
    /**
     * Funtion that saves image to users file system
     * @param imgName: name of the image
     */
    saveImage(imgName) {
      this.setAllVisible();
      var canvasElement = this.mainCanv;
      var MIME_TYPE = "image/png";
      var imgURL = canvasElement.toDataURL(MIME_TYPE);
      var dlLink = document.createElement("a");
      dlLink.download = imgName;
      dlLink.href = imgURL;
      dlLink.dataset.downloadurl = [
        MIME_TYPE,
        dlLink.download,
        dlLink.href,
      ].join(":");
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
      this.restoreCanvas();
    },
    /**
     * Function that set the simulation mode
     * @param mode: the new simulation mode
     */
    switchMode(mode) {
      this.mode = mode;
      if (this.currentDragging) {
        this.currentDraggingComponent.isDragging = false;
        this.currentDragging = false;
      }
      if (mode == "run") {
        store.dispatch("simulationStore/addAllInputComponents");
      } else if (mode == "edit") {
        store.dispatch("simulationStore/stopSimulation");
      } else if (mode == "stepper") {
        store.dispatch("simulationStore/addAllInputComponents", {
          startSimulation: false,
        });
      }
      drawMixin.methods.drawMain.call(this, this.click);
      this.$parent.setButtonsToMode(mode);
    },
    /**
     * Function that updates the logic
     */
    update() {
      var wires = store.getters["simulationStore/getWiresToUpdate"];
      if (wires === undefined) {
        document.location.reload(true);
        return;
      }
      while (wires.length > 0) {
        var wire = wires.shift();
        var id = wire.id;
        wire = this.wires.get(wire.id);
        if (wire === undefined) {
          continue;
        }
        this.drawWire(wire.path, id);
      }
      if (this.$refs.analyzerModal !== null) {
        this.$refs.analyzerModal.callUpdate(); //call update for chart
      }
      var logicAnalysers =
        store.getters["simulationStore/componentStore/getLogicAnalysers"];
      if (logicAnalysers === undefined) {
        return;
      }
      this.checkLeds();
    },
    /**
     * Function that zooms in the canvas
     */
    zoomin() {
      if (this.zoom.scaleFactor < 4) {
        this.zoom.scaleFactor *= 1.25;
        this.ctxMainCanv.scale(1.25, 1.25);
        // this.drawMain(this.click);
        drawMixin.methods.drawMain.call(this, this.click);
      }
    },
    /**
     * Function that zooms out the canvas
     */
    zoomout() {
      if (this.zoom.scaleFactor > 1) {
        this.zoom.scaleFactor /= 1.25;
        this.ctxMainCanv.scale(0.8, 0.8);
        // this.drawMain(this.click);
        drawMixin.methods.drawMain.call(this, this.click);
      }
    },
    /**
     * Function that returns the coordinates of a mouse click
     * @param canvas: the canvas that is clicked
     * @param evt: the click event
     * @return: an object with the coordinates {x, y}
     */
    getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      let mousePos = {
        x:
          this.canvas.xOffset +
          (evt.clientX - rect.left) / this.zoom.scaleFactor,
        y:
          this.canvas.yOffset +
          (evt.clientY - rect.top) / this.zoom.scaleFactor,
      };
      mousePos.x = (mousePos.x / rect.width) * this.canvas.canvWidth;
      mousePos.y = (mousePos.y / rect.height) * this.canvas.canvHeight;
      this.click.x = mousePos.x;
      this.click.y = mousePos.y;
      return mousePos;
    },
    /**
     * A function that rounds a coordinate to its nearest top left corner of the grid
     * @param pos: the position to be rounded
     * @return: the rounded position {x,y}
     */
    roundPos(pos) {
      return {
        x: pos.x - (pos.x % this.canvas.gridInterval),
        y: pos.y - (pos.y % this.canvas.gridInterval),
      };
    },
    /**
     * TODO: comment
     */
    resizeCanvas() {
      this.zoom.scaleFactor = 1;
      this.canvas.canvHeight =
        window.innerHeight - document.getElementById("mainCanv").offsetTop;
      this.canvas.canvWidth = window.innerWidth - 200;
      this.mainCanv.height = this.canvas.canvHeight;
      this.mainCanv.width = this.canvas.canvWidth;
      var t = this;
      setTimeout(() => {
        t.drawContent(t.click);
      }, 10);
    },
    /**
     * A function that changes the key of a component in the components map and in its wires
     * @param newKey: the new key for the component
     * @param oldKey: the old key for the component
     */
    changeKey(newKey, oldKey) {
      if (oldKey != newKey) {
        this.components.set(newKey, this.components.get(oldKey));
        this.components.delete(oldKey);
        this.currTemp.x = undefined;
        this.currTemp.y = undefined;
        var newLocation = newKey.split("-");
        this.components.get(newKey).x = parseInt(newLocation[0]);
        this.components.get(newKey).y = parseInt(newLocation[1]);
        saveMixin.methods.updateLocation.call(this, oldKey, {
          x: newLocation[0],
          y: newLocation[1],
        });
      }
      for (var i of this.components.get(newKey).inWireIds) {
        if (this.wires.get(i) !== undefined) {
          this.wires.get(i).entryTo = newKey;
          saveMixin.methods.updateWireLocal.call(this, i, newKey, false);
        }
      }
      for (var j of this.components.get(newKey).outWireIds) {
        if (this.wires.get(j) !== undefined) {
          this.wires.get(j).entryFrom = newKey;
          saveMixin.methods.updateWireLocal.call(this, j, newKey, true);
        }
      }
    },
    /**
     * A function that checks if a components exists at given coordinates
     * @param x: the x coordinate
     * @param y: the y coordinate
     * @return true if there is a component at the given coordinates
     */
    componentExistsAt(x, y) {
      return this.components.has(`${x}-${y}`);
    },
    /**
     * function that downloads json file
     */
    downloadJson() {
      saveMixin.methods.saveToJson.call(this);
      this.$refs.saveModal.setJsonString(this.JSONString);
      this.$refs.saveModal.downloadJson(); //call to download the document
    },
    /**
     * Function that reads a json file
     * @param newFile: a string with JSON information to read from
     */
    uploadJson(newFile) {
      this.JSONString = newFile;
      this.clear(true);
      saveMixin.methods.readFromJson.call(this);
      this.hideLoadModal();
      drawMixin.methods.drawMain.call(this, this.click);
    },
    //function that updates the image of a led
    checkLeds() {
      var type = undefined;
      this.leds.forEach((led) => {
        if (
          store.getters["simulationStore/componentStore/getValueOfPinOrLed"]({
            id: led.id,
          })
        ) {
          type = "led-on";
        } else {
          type = "led-off";
        }
        this.ctxMainCanv.drawImage(
          document.getElementById(type),
          led.x + 2 - this.canvas.xOffset,
          led.y - this.canvas.yOffset,
          this.canvas.gridInterval,
          this.canvas.gridInterval
        );
      });
    },
    /**
     * When the user clicks in the wiring 1 state, checks if there is a component on pos and starts a wire from here if there is a component
     * @param pos: the position of the click
     */
    wiring1Clicked(pos) {
      return clickMixin.methods.wiring1Clicked.call(this, pos);
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
      editMixin.methods.addWire.call(
        this,
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
        addToUndo
      );
    },
    /**
     * When the user clicks in the wiring 2 state, checks if there is a component on pos and wires to the component if there was one, otherwise it will add an inflection point
     * @param pos: the position of the click
     */
    wiring2Clicked(pos) {
      clickMixin.methods.wiring2Clicked.call(this, pos);
    },
    /**
     * Function that checks if a component is allowed to have a new wire
     * @param posString: location of component
     * @param halfClicked: which half was clicked
     * @return true if the component is allowed to have a new wire otherwise false
     */
    checkComponentTypeWiring(posString, halfClicked) {
      return clickMixin.methods.checkComponentTypeWiring.call(
        this,
        posString,
        halfClicked
      );
    },
    /**
     * Function that adds an inflection point the the wire that is currently being connected
     * @param pos: position of the inflection point
     */
    addInflectionPoint(pos) {
      editMixin.methods.addInflectionPoint.call(this, pos);
    },
    /**
     * Function that updates the bounds of the simulator if needed
     * @param pos: coordinate to check if it exceeds the previous bounds
     */
    checkBounds(pos) {
      //set xMin, xMax, yMin, yMax if needed
      if (this.canvas.xMin > pos.x - (pos.x % this.canvas.gridInterval)) {
        this.canvas.xMin = pos.x - (pos.x % this.canvas.gridInterval);
      }
      if (this.canvas.xMax < pos.x - (pos.x % this.canvas.gridInterval)) {
        this.canvas.xMax = pos.x - (pos.x % this.canvas.gridInterval);
      }
      if (this.canvas.yMin > pos.y - (pos.y % this.canvas.gridInterval)) {
        this.canvas.yMin = pos.y - (pos.y % this.canvas.gridInterval);
      }
      if (this.canvas.yMax < pos.y - (pos.y % this.canvas.gridInterval)) {
        this.canvas.yMax = pos.y - (pos.y % this.canvas.gridInterval);
      }
    },
    /**
     * Function that decides which type of path needs to be made and calls the correct function to make that path
     * @returns: path2D object for the correct path
     */
    makePath(entryFrom, entryTo, wireId) {
      return pathMixin.methods.makePath.call(this, entryFrom, entryTo, wireId);
    },
    /**
     * Function that resets currentcomponent, used for keybind
     */
    resetCurrent() {
      if (this.getCurrentComponent == "wiring2") {
        this.wires.delete(this.highestWireId);
        this.$store.commit("canvasStore/setCurrent", "wiring1");
      } else if (this.currentDragging) {
        this.currentDraggingComponent.isDragging = false;
        this.currentDragging = false;
        drawMixin.methods.drawMain.call(this, this.click);
      } else {
        store.commit("canvasStore/emptyCurrent");
      }
    },
    /**
     * Function that adds a compnent to the hashmap and to the model (editMixin has full function)
     */
    addComponent(
      pos,
      type,
      id = this.highestId,
      addToUndo = true,
      extra = undefined
    ) {
      //function that adds a component to components based on click position and current type
      editMixin.methods.addComponent.call(
        this,
        pos,
        type,
        id,
        addToUndo,
        extra
      );
      drawMixin.methods.drawMain.call(this, this.click);
    },
    /**
     * Function that sets inputsequencer values in the model
     */
    setInputSequencerValues(vals, id, posString) {
      //this.inputSequencerModal.inputSequencerValues = vals;
      if (
        store.getters["simulationStore/componentStore/getComponent"]({
          id: id,
        }) !== undefined
      ) {
        store.commit("simulationStore/componentStore/setInputSequencerValues", {
          id: id,
          values: vals,
        });
        saveMixin.methods.updateTime(posString, vals);
        this.inputSequencerModal.inputSequencerId = -1;
      } else {
        store.dispatch("simulationStore/componentStore/addNewComponentOfType", {
          id: this.highestId,
          type: "input-sequencer",
          values: vals,
        });

        var pos = posString.split("-");

        var action = new AddComponentAction(
          "input-sequencer",
          this.highestId,
          this,
          { x: parseInt(pos[0]), y: parseInt(pos[1]) },
          undefined,
          vals
        );
        store.commit("canvasStore/pushUndoStack", action);

        saveMixin.methods.addComponentToLocal.call(this, posString);
        this.highestId++;
      }
      //saveMixin.methods.addComponentToLocal.call(this, store.getters.getComponent());
      this.hideInputSequencerModal();
    },
    /**
     * function that sets the delay of the current dragging component
     * @param value: the new delay
     */
    setDelayValue(value) {
      let t = this;
      store.commit("simulationStore/componentStore/setComponentDelay", {
        id: t.currentDraggingComponent.id,
        delay: value,
      });
      saveMixin.methods.updateTime(
        `${t.currentDraggingComponent.x}-${t.currentDraggingComponent.y}`,
        parseInt(value)
      );
      this.hideDelayModal();
      drawMixin.methods.drawMain.call(this, this.click);
    },
    /**
     * function that sets the delay of a clock
     * @param value: the new timing
     * @param id: the id of the clock
     * @param posString: the posString of the clock
     */
    setTimingValue(value, id, posString) {
      if (
        store.getters["simulationStore/componentStore/getComponent"]({
          id: id,
        }) !== undefined
      ) {
        store.commit("simulationStore/componentStore/setClockTiming", {
          id: parseInt(id),
          timing: parseInt(value),
        });

        saveMixin.methods.updateTime.call(this, posString, parseInt(value));
      } else {
        var pos = posString.split("-");
        store.dispatch("simulationStore/componentStore/addNewComponentOfType", {
          id: parseInt(id),
          type: "clock",
          timing: parseInt(value),
        });

        var action = new AddComponentAction(
          "clock",
          parseInt(id),
          this,
          { x: parseInt(pos[0]), y: parseInt(pos[1]) },
          parseInt(value)
        );
        store.commit("canvasStore/pushUndoStack", action);

        this.highestId++;

        saveMixin.methods.addComponentToLocal.call(this, posString);
      }
      drawMixin.methods.drawMain.call(this, this.click);
    },
    /**
     * Function that is called when the canvas is clicked and the state is empty, it will start to drag a new component or it wil drag a selected component to its new location
     * @param pos: the position of the click
     */
    emptyClicked(pos) {
      clickMixin.methods.emptyClicked.call(this, pos);
    },
    /**
     * Function that removes a component
     * @param pos: the position of the component
     * @param addToUndo: wether or not to add the action to undo
     */
    removeComponent(pos, addToUndo = true) {
      //function that removes component at position pos from components
      editMixin.methods.removeComponent.call(this, pos, addToUndo);
      drawMixin.methods.drawMain.call(this, this.click);
    },
    /**
     * Function that removes a wire
     * @param id: the if of the wire
     * @param addToUndo: wether or not to add the action to undo
     */
    removeWire(id, addToUndo = true) {
      return editMixin.methods.removeWireCaller.call(this, id, addToUndo);
    },
    removeWireClick(mousePos) {
      clickMixin.methods.removeWireClick.call(this, mousePos);
    },
    setLanguage() {
      this.$refs.analyzerModal.translateModal();
    },
  },
  computed: {
    isModalOpen() {
      return (
        this.inputSequencerModal.displayInputSequencerModal ||
        this.delayModal.displayDelayModal ||
        this.displaySaveModal ||
        this.displayImageModal ||
        this.clockModal.displayClockModal ||
        this.displayNewModal
      );
    },
    canvasEnabled() {
      return this.canvas.canvasEnabled;
    },
    getCurrentComponent() {
      if (this.canvas.canvasEnabled) {
        return store.getters["canvasStore/getCurrent"];
      } else {
        return "empty";
      }
    },
    getOpenLogicAnalyzer() {
      return store.getters["canvasStore/getOpenLogicAnalyzer"];
    },
    getOpenImageModal() {
      return store.getters["canvasStore/getOpenImageModal"];
    },
    getSaveLoadWatcher() {
      return store.getters["canvasStore/getSaveLoadWatcher"];
    },
  },
  watch: {
    canvasEnabled(value) {
      this.$parent.showApp(value);
    },
    getCurrentComponent(newValue, oldValue) {
      if (this.currentDragging) {
        this.currentDraggingComponent.isDragging = false;
        this.currentDragging = false;
      }
      if (oldValue == "wiring2" && newValue != "wiring1") {
        this.wires.delete(this.highestWireId);
      }

      if (newValue == "wiring1" || newValue == "wiring2") {
        this.$parent.setUndoRedoEnabled(false);
      } else {
        this.$parent.setUndoRedoEnabled(true);
      }

      // this.drawMain({ x: this.click.x, y: this.click.y });
      drawMixin.methods.drawMain.call(this, {
        x: this.click.x,
        y: this.click.y,
      });
    },
    getOpenLogicAnalyzer(newValue) {
      if (newValue) {
        this.toggleAnalyzerModal();
        store.commit("canvasStore/setOpenLogicAnalyzer", false);
      }
    },
    getOpenImageModal(newValue) {
      if (newValue) {
        this.openImageModal();
        store.commit("canvasStore/setOpenImageModal", false);
      }
    },
    getSaveLoadWatcher(newValue) {
      if (newValue == "save") {
        this.displaySaveModal = true;
      } else if (newValue == "load") {
        this.displayLoadModal = true;
      }
      store.commit("canvasStore/setSaveLoadWatcher", "empty");
    },
  },
  mounted() {
    this.intersectionChecker = new IntersectionChecker();
    this.mainCanv = document.getElementById("mainCanv");
    this.mainCanv.onselectstart = function () {
      return false;
    }; //otherwise clicking the canvas selects text in truthtable
    this.ctxMainCanv = this.mainCanv.getContext("2d");
    var t = this;
    //load the previous circuit if the last image is loaded
    document.getElementById("led-off").onload = function () {
      //if all images are loaded in -> load from local storage
      t.clear(false);
      if (localStorage.getItem("save")) {
        saveMixin.methods.loadFromLocal.call(t);
      } else {
        t.clear(true);
      }
      t.canvas.canvasEnabled = true;
    };
    this.canvas.wirePath = new Path2D();
    this.drawGrid();
    this.mainCanv.addEventListener(
      "click",
      function (evt) {
        clickMixin.methods.leftClickFunction.call(t, evt);
      },
      false
    );
    this.mainCanv.addEventListener("mousemove", function (evt) {
      clickMixin.methods.mouseMoveFunction.call(t, evt);
    });
    let upscrolls = 0;
    let downscrolls = 0;
    this.mainCanv.addEventListener(
      "wheel",
      function (evt) {
        evt.preventDefault();
        if (evt.deltaY > 0) {
          if (upscrolls >= 5) {
            upscrolls = 0;
            t.zoomout(evt);
          }
          upscrolls++;
        } else {
          if (downscrolls >= 5) {
            downscrolls = 0;
            t.zoomin(evt);
          }
          downscrolls++;
        }
      },
      { passive: false }
    );
    this.mainCanv.addEventListener(
      "contextmenu",
      function (ev) {
        ev.preventDefault();
        clickMixin.methods.rightClickFunction.call(t, ev);
      },
      false
    );
    window.addEventListener("resize", t.resizeCanvas);
    document.addEventListener("keydown", function (event) {
      clickMixin.methods.keyClickFunction.call(t, event);
    });
    store.dispatch("simulationStore/addView", t);
  },
};
</script>

<style>
#mainCanv {
  border: 4px solid gray;
  border-radius: 0 0 25px 0;
}
</style>
