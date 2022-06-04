<template>
  <div id="wrapper">
    <div id="navbar" class="navbar">
      <NavBar id="navBar" ref="translatable" />
    </div>
    <div class="text-left">
      <div class="btn btn-group">
        <div @click="runmode" id="run-btn" width="30" height="30">
          <span>
            <img
              width="30"
              height="30"
              src="./assets/images/run.png"
              alt="Run"
            /> </span
          ><br /><small id="run-text">RUN</small>
        </div>
        <div @click="editmode" id="edit-btn" width="30" height="30">
          <span>
            <img
              width="30"
              height="30"
              src="./assets/images/edit.png"
              alt="Edit"
            /> </span
          ><br /><small id="edit-text">EDIT</small>
        </div>
        <div @click="steppermode" id="stepper-btn" width="30" height="30">
          <span>
            <img
              width="30"
              height="30"
              src="./assets/images/next.png"
              alt="Stepper"
            /> </span
          ><br /><small id="stepper-text">STEPPER</small>
        </div>
      </div>

      <div class="text-right btn btn-group">
        <div
          @click="this.undoEnabled ? undo() : null"
          id="undo-btn"
          width="30"
          height="30"
        >
          <span>
            <img
              width="30"
              height="30"
              src="./assets/images/undo.png"
              alt="Undo"
            /> </span
          ><br /><small id="undo-text">UNDO</small>
        </div>
        <div
          @click="this.undoEnabled ? redo() : null"
          id="redo-btn"
          width="30"
          height="30"
        >
          <span>
            <img
              width="30"
              height="30"
              src="./assets/images/redo.png"
              alt="Redo"
            /> </span
          ><br /><small id="redo-text">REDO</small>
        </div>
      </div>
    </div>
    <div class="">
      <div id="guide">
        <GuidedTour ref="guide" />
      </div>
    </div>
    <div class="d-flex flex-row">
      <div class="d-flex flex-column">
        <div id="Toolbar">
          <ToolbarCanvas ref="translatable" />
        </div>
        <div id="ComponentInfo">
          <ComponentInfo ref="componentInfo" />
        </div>
      </div>
      <div class="">
        <div id="MainCanvas">
          <MainCanvas ref="mainCanvas" />
        </div>
      </div>
    </div>
  </div>
  <div id="loading">
    <h1 id="loading-txt">Loading...</h1>
  </div>
</template>
<script>
import MainCanvas from "./components/MainCanvas.vue";
import ToolbarCanvas from "./components/ToolbarCanvas.vue";
import NavBar from "./components/NavBar.vue";
import GuidedTour from "./components/GuidedTour.vue";
import ComponentInfo from "./components/ComponentInfo.vue";
import store from "./store";

export default {
  name: "App",
  components: {
    NavBar,
    MainCanvas,
    ToolbarCanvas,
    GuidedTour,
    ComponentInfo,
  },

  data() {
    return {
      lang: "eng",
      undoEnabled: true,
    };
  },

  watch: {
    undoEnabled() {
      if (this.undoEnabled === true) {
        document.getElementById("undo-btn").style.opacity = "1.0";
        document.getElementById("redo-btn").style.opacity = "1.0";
      } else {
        document.getElementById("undo-btn").style.opacity = "0.5";
        document.getElementById("redo-btn").style.opacity = "0.5";
      }
    },
  },

  methods: {
    setUndoRedoEnabled(state) {
      this.undoEnabled = state;
    },
    getOffset(el) {
      const rect = el.getBoundingClientRect();
      return {
        right: rect.right + window.scrollX,
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        width: (rect.left + rect.right + window.scrollX) / 2,
        height: (rect.top + rect.bottom + window.scrollY) / 4,
      };
    },
    runmode() {
      this.$refs.mainCanvas.switchMode("run");
      this.$refs.translatable.switchMode("run");
    },

    editmode() {
      this.$refs.mainCanvas.switchMode("edit");
      this.$refs.translatable.switchMode("edit");
    },

    steppermode() {
      if (this.$refs.mainCanvas.getMode() !== "stepper") {
        this.$refs.mainCanvas.switchMode("stepper");
        this.$refs.translatable.switchMode("stepper");
      } else {
        this.$refs.mainCanvas.nextStep();
      }
    },

    setButtonsToMode(mode) {
      if (mode === "run") {
        document.getElementById("run-btn").style.display = "none";
        document.getElementById("edit-btn").style.display = "block";
        document.getElementById("stepper-btn").style.display = "none";

        document.getElementById("edit-btn").disabled = false;
        document.getElementById("run-btn").disabled = true;
        document.getElementById("stepper-btn").disabled = false;

        this.undoEnabled = false;
      } else if (mode === "edit") {
        document.getElementById("run-btn").style.display = "block";
        document.getElementById("edit-btn").style.display = "none";
        document.getElementById("stepper-btn").style.display = "block";

        document.getElementById("edit-btn").disabled = true;
        document.getElementById("run-btn").disabled = false;
        document.getElementById("stepper-btn").disabled = false;
        if (document.getElementById("next-text") != null) {
          document.getElementById("next-text").id = "stepper-text";
        }
        this.undoEnabled = true;
      } else if (mode === "stepper") {
        if (document.getElementById("stepper-text") != null) {
          document.getElementById("stepper-text").id = "next-text";
        }

        document.getElementById("run-btn").style.display = "none";
        document.getElementById("edit-btn").style.display = "block";
        document.getElementById("stepper-btn").style.display = "block";

        document.getElementById("edit-btn").disabled = false;
        document.getElementById("run-btn").disabled = true;

        this.undoEnabled = false;
      }
      this.setLanguage(undefined);
    },

    setLanguage(l) {
      if (l != undefined) {
        store.commit("canvasStore/setCurrLanguage", l);
      }
      var lang = store.getters["canvasStore/getCurrLanguage"];
      this.$refs.translatable.setLanguage(lang);
      let langObj = null;
      try {
        const file = require("./assets/languages/" + lang + ".json");
        langObj = JSON.parse(JSON.stringify(file));
      } catch (e) {
        console.log("error loading language file");
      } finally {
        this.currLanguage = lang;
        this.$refs.mainCanvas.setLanguage();
        this.$refs.guide.translate(lang);
        document.getElementById("loading-txt").innerHTML =
          langObj["loading-txt"];
      }
    },
    setGuide() {
      this.lang = store.getters["canvasStore/getCurrLanguage"];
      this.$refs.guide.addStep(
        "welcome",
        this.getOffset(document.getElementById("Toolbar")).width,
        this.getOffset(document.getElementById("Toolbar")).height,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "ToolbarExplanation",
        this.getOffset(document.getElementById("Toolbar")).width,
        this.getOffset(document.getElementById("Toolbar")).height,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "ToolbarExplanation2",
        this.getOffset(document.getElementById("Toolbar")).width,
        this.getOffset(document.getElementById("Toolbar")).height,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "MaincanvasExplanation",
        this.getOffset(document.getElementById("MainCanvas")).width,
        this.getOffset(document.getElementById("MainCanvas")).height,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "NavbarExplanation",
        this.getOffset(document.getElementById("run-btn")).left + 100,
        this.getOffset(document.getElementById("navbar")).top - 50,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "RunEditButtonsExplanation",
        this.getOffset(document.getElementById("edit-btn")).left,
        this.getOffset(document.getElementById("edit-btn")).height / 2,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "StepperExplanation",
        this.getOffset(document.getElementById("stepper-btn")).width / 2,
        this.getOffset(document.getElementById("stepper-btn")).height - 20,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "UndoRedoExplanation",
        this.getOffset(document.getElementById("redo-btn")).left - 30,
        this.getOffset(document.getElementById("redo-btn")).height / 2,
        this.lang,
        true
      );
      this.$refs.guide.addStep(
        "ShortCutExplanation",
        this.getOffset(document.getElementById("MainCanvas")).width,
        this.getOffset(document.getElementById("MainCanvas")).height,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "RightClickExplanation",
        this.getOffset(document.getElementById("MainCanvas")).width,
        this.getOffset(document.getElementById("MainCanvas")).height,
        this.lang,
        false
      );
      this.$refs.guide.addStep(
        "goodluck",
        this.getOffset(document.getElementById("MainCanvas")).width,
        this.getOffset(document.getElementById("MainCanvas")).height,
        this.lang,
        false
      );
    },

    undo() {
      this.$refs.mainCanvas.undo();
    },
    redo() {
      this.$refs.mainCanvas.redo();
    },
    startGuide() {
      this.$refs.guide.startTour();
    },
    newCanvas() {
      this.$refs.mainCanvas.showNewModal();
    },
    showApp(state) {
      document.getElementById("wrapper").style.display = state
        ? "block"
        : "none";
      document.getElementById("loading").style.display = !state
        ? "block"
        : "none";
      if (state) {
        this.setGuide();
        if (localStorage.getItem("guideDone") === null) {
          this.startGuide();
        }
      }
    },
  },

  mounted() {
    document.getElementById("wrapper").style.display = "none";
    document.getElementById("loading").style.display = "block";
    if (
      localStorage.getItem("lang") === null ||
      localStorage.getItem("lang") === undefined
    ) {
      localStorage.setItem("lang", "eng");
    }
    this.setLanguage();
    let t = this;
    setTimeout(() => {
      if (t.$refs.mainCanvas.canvasEnabled) {
        return;
      }
      let langObj = null;
      if (t.currLanguage === undefined) {
        t.currLanguage = "eng";
      }
      try {
        const file = require("./assets/languages/" +
          this.currLanguage +
          ".json");
        langObj = JSON.parse(JSON.stringify(file));
      } catch (e) {
        console.log("error loading language file");
      } finally {
        document.getElementById("loading-txt").innerHTML =
          langObj["loading-error-txt"];
      }
    }, 6000);
    document.getElementById("edit-btn").disabled = true;

    setInterval(() => {
      this.keepAwake = !this.keepAwake;
    }, 10000);
  },
};
</script>

<style>
/* center MainCanvas and Toolbar with toolbar 25% width and Maincanvas 75% width */

#app {
  text-align: center;
  color: #2c3e50;
}

#navbar {
  background-color: #f8f8f8;
  border-radius: 25px 25px 0 0;
  padding: 0 0 0 0;
}
#Toolbar {
  margin: 0;
  padding: 0;
  clear: both;
}

#MainCanvas {
  clear: both;
}

#ComponentInfo {
  padding: 0;
  margin: 0;
}

#TruthTable {
  float: top;
}

#loading {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 30em;
  height: 18em;
  margin-top: -9em;
  margin-left: -15em; 
}

.btn {
  vertical-align: 0;
}

.text-right {
  float: right;
  max-width: 50%;
  text-align: right;
  margin: 0;
  padding: 0;
}
.text-left {
  text-align: left;
  margin: 0;
  padding: 0;
}
#stepper-btn {
  margin-left: 2em;
}
#redo-btn {
  margin-left: 1em;
}
</style>
