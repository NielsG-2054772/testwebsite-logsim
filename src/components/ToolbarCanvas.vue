<template>
  <!-- <h1>Currently active: {{ currentActive }}</h1> -->
  <div id="toolbarDiv">
    <canvas
      id="toolbarCanv"
      class="w-100 h-100"
      :width="toolbarWidth"
      :height="1.1 * toolbarHeight"
    >
    </canvas>
  </div>
</template>
<script>
import store from "../store/index";
export default {
  name: "ToolbarCanvas",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return {
      ctxToolbarCanv: 0,
      toolbarCanv: 0,
      toolbarOffset: 50,
      toolbarHeight: 725,
      toolbarWidth: 225,
      iconSize: 50,
      yOffset: 0,
      mode: "edit",
      redrawing: false,
    };
  },
  methods: {
    switchMode(mode) {
      this.mode = mode;
      if (this.mode == "run") {
        store.commit("canvasStore/emptyCurrent");
      }
    },
    setLanguage(lang) {
      let langObj = null;
      try {
        const file = require("../assets/languages/" + lang + ".json");
        langObj = JSON.parse(JSON.stringify(file));
      } catch (e) {
        console.log("error loading language file");
      } finally {
        this.currLanguage = lang;
        var elements = document.querySelectorAll("*");
        elements.forEach((element) => {
          if (Object.prototype.hasOwnProperty.call(langObj, element.id)) {
            element.innerHTML = langObj[element.id];
          }
        });
      }
    },
    getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: ((evt.clientX - rect.left) / rect.width) * this.toolbarWidth,
        y: ((evt.clientY - rect.top) / rect.height) * 1.1 * this.toolbarHeight,
      };
    },
    drawToolbar() {
      let t = this;
      t.ctxToolbarCanv.font = "20px Arial";
      t.ctxToolbarCanv.clearRect(0, 0, t.toolbarWidth, t.toolbarHeight);
      var andImage = new Image();
      andImage.src = this.andIcon;
      andImage.onload = function () {
        t.ctxToolbarCanv.drawImage(andImage, 20, 0, t.iconSize, t.iconSize);
      };
      t.ctxToolbarCanv.fillText("AND gate", 0, 70);
      var orImage = new Image();
      orImage.src = this.orIcon;
      orImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          orImage,
          20 + t.toolbarOffset * 2,
          0,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText("OR gate", 10 + t.toolbarOffset * 2, 70);
      var nandImage = new Image();
      nandImage.src = this.nandIcon;
      nandImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          nandImage,
          20,
          t.toolbarOffset * 2,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText("NAND gate", 0, 70 + t.toolbarOffset * 2);
      var norImage = new Image();
      norImage.src = this.norIcon;
      norImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          norImage,
          20 + t.toolbarOffset * 2,
          t.toolbarOffset * 2,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText(
        "NOR gate",
        10 + t.toolbarOffset * 2,
        70 + t.toolbarOffset * 2
      );
      var xorImage = new Image();
      xorImage.src = this.xorIcon;
      xorImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          xorImage,
          20,
          t.toolbarOffset * 4,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText("XOR gate", 0, 70 + t.toolbarOffset * 4);
      var notImage = new Image();
      notImage.src = this.notIcon;
      notImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          notImage,
          20 + t.toolbarOffset * 2,
          t.toolbarOffset * 4,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText(
        "NOT gate",
        10 + t.toolbarOffset * 2,
        70 + t.toolbarOffset * 4
      );
      var xnorImage = new Image();
      xnorImage.src = this.xnorIcon;
      xnorImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          xnorImage,
          20,
          t.toolbarOffset * 6,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText("XNOR gate", 0, 70 + t.toolbarOffset * 6);
      var dFlipflopImage = new Image();
      dFlipflopImage.src = this.dFlipflopIcon;
      dFlipflopImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          dFlipflopImage,
          20 + t.toolbarOffset * 2,
          t.toolbarOffset * 6,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText(
        "D flipflop",
        10 + t.toolbarOffset * 2,
        70 + t.toolbarOffset * 6
      );
      var pinImage = new Image();
      pinImage.src = this.pinIcon;
      pinImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          pinImage,
          20,
          t.toolbarOffset * 8,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText("Button", 20, 70 + t.toolbarOffset * 8);
      var latchImage = new Image();
      latchImage.src = this.srLatchIcon;
      latchImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          latchImage,
          20 + t.toolbarOffset * 2,
          t.toolbarOffset * 8,
          t.iconSize * 0.9,
          t.iconSize * 0.9
        );
      };
      t.ctxToolbarCanv.fillText(
        "SR latch",
        10 + t.toolbarOffset * 2,
        70 + t.toolbarOffset * 8
      );
      var clockImage = new Image();
      clockImage.src = this.clockIcon;
      clockImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          clockImage,
          20,
          t.toolbarOffset * 10,
          t.iconSize,
          t.iconSize
        );
      };

      t.ctxToolbarCanv.fillText("Clock", 20, 70 + t.toolbarOffset * 10);
      var logicAnalyserImage = new Image();
      logicAnalyserImage.src = this.logicAnalyzerIcon;
      logicAnalyserImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          logicAnalyserImage,
          20,
          t.toolbarOffset * 12,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText("Logic anlz", 0, 70 + t.toolbarOffset * 12);
      var inputSequencerImage = new Image();
      inputSequencerImage.src = this.inputSequencerIcon;
      inputSequencerImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          inputSequencerImage,
          20 + t.toolbarOffset * 2,
          t.toolbarOffset * 10,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText(
        "Input sqr",
        20 + t.toolbarOffset * 2,
        70 + t.toolbarOffset * 10
      );
      var ledOnImage = new Image();
      ledOnImage.src = this.ledOnIcon;
      ledOnImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          ledOnImage,
          20 + t.toolbarOffset * 2,
          t.toolbarOffset * 12,
          t.iconSize,
          t.iconSize
        );
      };
      t.ctxToolbarCanv.fillText(
        "LED",
        20 + t.toolbarOffset * 2,
        70 + t.toolbarOffset * 12
      );

      this.redrawWiring();
      this.ctxToolbarCanv.clearRect(10, t.toolbarOffset * 14 - 10, 70, 100);
      if (!this.redrawing) {
        this.redrawing = false;
        this.redrawGarbageCan();
      } else {
        setTimeout(() => this.redrawGarbageCan(), 500);
      }
    },
    redrawWiring() {
      let t = this;
      this.ctxToolbarCanv.clearRect(
        t.toolbarOffset * 2 - 10,
        t.toolbarOffset * 14 - 10,
        80,
        80
      );
      let wireImage = new Image();
      wireImage.src = this.wireIcon;
      wireImage.onload = function () {
        t.ctxToolbarCanv.drawImage(
          wireImage,
          10 + t.toolbarOffset * 2,
          t.toolbarOffset * 14,
          t.iconSize,
          t.iconSize
        );
      };
      if (
        this.getCurrentComponent == "wiring1" ||
        this.getCurrentComponent == "wiring2"
      ) {
        t.ctxToolbarCanv.beginPath();
        t.ctxToolbarCanv.rect(
          10 + t.toolbarOffset * 2,
          t.toolbarOffset * 14,
          t.iconSize,
          t.iconSize
        );
        t.ctxToolbarCanv.strokeStyle = "#FF0000";
        t.ctxToolbarCanv.stroke();
        t.ctxToolbarCanv.closePath();
        t.ctxToolbarCanv.strokeStyle = "#000000";
      }
      t.ctxToolbarCanv.fillText(
        "Wiring",
        10 + t.toolbarOffset * 2,
        70 + t.toolbarOffset * 14
      );
    },
    redrawGarbageCan() {
      var t = this;
      this.ctxToolbarCanv.clearRect(10, t.toolbarOffset * 14 - 10, 70, 100);
      if (this.getCurrentComponent == "deleting") {
        let openGarbageImage = new Image();
        openGarbageImage.src = this.openGarbageIcon;
        openGarbageImage.onload = function () {
          t.ctxToolbarCanv.drawImage(
            openGarbageImage,
            20,
            t.toolbarOffset * 14,
            t.iconSize,
            t.iconSize
          );
          t.ctxToolbarCanv.beginPath();
          t.ctxToolbarCanv.rect(20, t.toolbarOffset * 14, 50, 50);
          t.ctxToolbarCanv.strokeStyle = "#FF0000";
          t.ctxToolbarCanv.stroke();
          t.ctxToolbarCanv.closePath();
          t.ctxToolbarCanv.strokeStyle = "#000000";
        };
      } else {
        var garbageImage = new Image();
        garbageImage.src = this.garbageIcon;
        garbageImage.onload = function () {
          t.ctxToolbarCanv.drawImage(
            garbageImage,
            20,
            t.toolbarOffset * 14,
            t.iconSize,
            t.iconSize
          );
        };
      }
      t.ctxToolbarCanv.fillText("Delete", 15, 70 + t.toolbarOffset * 14);
      this.redrawing = true;
    },
    checkQuadrant(pos, y, x) {
      return (
        (x % 2) * 2 + this.iconSize / 2 <= pos.x &&
        pos.x <= this.toolbarOffset * (1 + 2 * x) + this.iconSize / 2 &&
        this.toolbarOffset * 2 * y <= pos.y - (pos.y % 10) &&
        pos.y - (pos.y % 10) <= this.toolbarOffset * (1 + 2 * y)
      );
    },
    resizeCanvas() {
      // document.getElementById("toolbarDiv").style.height =
      //   this.toolbarHeight + "px";
      // document.getElementById("toolbarDiv").style.width =
      //   this.toolbarWidth + "px";

      // this.toolbarDiv.style.height = this.toolbarHeight;
      // this.toolbarDiv.style.width = this.toolbarWidth;
      this.drawToolbar();
    },
    toolbarClicked(pos) {
      if (
        //(0,0)
        this.checkQuadrant(pos, 0, 0)
      ) {
        this.$store.commit("canvasStore/setCurrent", "and-gate");
      } else if (
        //(0,1)
        this.checkQuadrant(pos, 0, 1)
      ) {
        this.$store.commit("canvasStore/setCurrent", "or-gate");
      } else if (
        //(1,0)
        this.checkQuadrant(pos, 1, 0)
      ) {
        this.$store.commit("canvasStore/setCurrent", "nand-gate");
      } else if (
        //(1,1)
        this.checkQuadrant(pos, 1, 1)
      ) {
        this.$store.commit("canvasStore/setCurrent", "nor-gate");
      } else if (
        //(2,0)
        this.checkQuadrant(pos, 2, 0)
      ) {
        this.$store.commit("canvasStore/setCurrent", "xor-gate");
      } else if (
        //(2,1)
        this.checkQuadrant(pos, 2, 1)
      ) {
        this.$store.commit("canvasStore/setCurrent", "not-gate");
      } else if (
        //(3,0)
        this.checkQuadrant(pos, 3, 0)
      ) {
        this.$store.commit("canvasStore/setCurrent", "xnor-gate");
      } else if (
        //(3,1)
        this.checkQuadrant(pos, 3, 1)
      ) {
        this.$store.commit("canvasStore/setCurrent", "d-flipflop");
      } else if (
        // (4, 0)
        this.checkQuadrant(pos, 4, 0)
      ) {
        this.$store.commit("canvasStore/setCurrent", "pin");
      } else if (this.checkQuadrant(pos, 4, 1)) {
        this.$store.commit("canvasStore/setCurrent", "sr-latch");
      } else if (
        //linksonder
        this.checkQuadrant(pos, 5, 0)
      ) {
        this.$store.commit("canvasStore/setCurrent", "clock");
      } else if (
        //linksonder
        this.checkQuadrant(pos, 6, 0)
      ) {
        this.$store.commit("canvasStore/setCurrent", "logic-analyser");
      } else if (this.checkQuadrant(pos, 5, 1)) {
        this.$store.commit("canvasStore/setCurrent", "input-sequencer");
      } else if (this.checkQuadrant(pos, 6, 1)) {
        this.$store.commit("canvasStore/setCurrent", "LED");
      } else if (this.checkQuadrant(pos, 7, 0)) {
        if (this.getCurrentComponent == "deleting") {
          this.$store.commit("canvasStore/setCurrent", "empty");
        } else {
          this.$store.commit("canvasStore/setCurrent", "deleting");
        }
      } else if (this.checkQuadrant(pos, 7, 1)) {
        this.$store.commit("canvasStore/setCurrent", "wiring1");
      } else {
        this.$store.commit("canvasStore/setCurrent", "empty");
      }
    },
  },
  computed: {
    andIcon() {
      return require("@/assets/images/logic-gate-and-svgrepo-com.png");
    },
    nandIcon() {
      return require("@/assets/images/logic-gate-nand.png");
    },
    orIcon() {
      return require("@/assets/images/logic-gate-or-svgrepo-com.png");
    },
    norIcon() {
      return require("@/assets/images/logic-gate-nor.png");
    },
    garbageIcon() {
      return require("@/assets/images/garbage-bin-garbage-can-garbage-container-trash-bin-trash-can-icon-431304.png");
    },
    openGarbageIcon() {
      return require("@/assets/images/49854.png");
    },
    xorIcon() {
      return require("@/assets/images/logic-gate-xor-svgrepo-com.png");
    },
    xnorIcon() {
      return require("@/assets/images/logic-gate-nxor-svgrepo-com.png");
    },
    dFlipflopIcon() {
      return require("@/assets/images/D-Type_Flip-flop.png");
    },
    srLatchIcon() {
      return require("@/assets/images/sr-latch.png");
    },
    notIcon() {
      return require("@/assets/images/logic-gate-not-svgrepo-com.png");
    },
    pinIcon() {
      return require("@/assets/images/input_undefined.png");
    },
    wireIcon() {
      return require("@/assets/images/wiretool.png");
    },
    clockIcon() {
      return require("@/assets/images/clock.png");
    },
    logicAnalyzerIcon() {
      return require("@/assets/images/logic-analyzer.png");
    },
    inputSequencerIcon() {
      return require("@/assets/images/input_sequencer.png");
    },
    ledOnIcon() {
      return require("@/assets/images/led-on.png");
    },
    getCurrentComponent() {
      return store.getters["canvasStore/getCurrent"];
    },
  },
  watch: {
    getCurrentComponent(newValue, oldValue) {
      if (newValue == "deleting" || oldValue == "deleting")
        this.redrawGarbageCan();
      if (
        newValue == "wiring1" ||
        newValue == "wiring2" ||
        oldValue == "wiring1" ||
        oldValue == "wiring2"
      )
        this.redrawWiring();
    },
  },

  mounted() {
    this.toolbarCanv = document.getElementById("toolbarCanv");
    this.toolbarCanv.onselectstart = function () {
      return false;
    }; //otherwise clicking the canvas selects text in truthtable
    this.ctxToolbarCanv = this.toolbarCanv.getContext("2d");
    var t = this;
    this.drawToolbar();
    window.addEventListener("resize", t.resizeCanvas);
    window.addEventListener("resize", t.drawToolbar);
    t.toolbarCanv.addEventListener(
      "click",
      function (evt) {
        if (t.mode == "run") {
          return;
        }
        var mousePos = t.getMousePos(t.toolbarCanv, evt);
        t.toolbarClicked(mousePos);
        if (t.$refs.truthTable != undefined) {
          t.$refs.truthTable.refreshTruthTable();
        }
      },
      false
    );
  },
};
</script>

<style>
#toolbarDiv {
  max-height: 50vh;
  overflow-y: scroll;
  border: 4px solid gray;
  border-right-width: 0px;
}
#toolbarCanv {
  display: block;
}
</style>
