<template>
  <div class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="savetitle" class="modal-title">Save current circuit</h5>
          </div>
          <div id="form-body" class="modal-body overflow-auto">
            <h6 id="asksave">
              Do you want to save the current circuit as LSM?
            </h6>
            <p id="filenamelabel">Name for the file:</p>
            <input v-model="fileName" />
          </div>
          <div class="modal-footer">
            <button
              id="save-btn"
              type="button"
              class="btn btn-success"
              @click="saveCircuit"
            >
              Save
            </button>
            <button
              id="close-btn"
              type="button"
              class="btn btn-danger"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store/index.js";
export default {
  name: "SaveModal",
  data() {
    return {
      jsonString: "",
      fileName: "LogicaSimulatorSave",
    };
  },
  methods: {
    setFocus() {
      document.getElementById("fileName").focus();
    },
    closeModal() {
      this.$emit("close-save-modal-event");
    },
    saveCircuit() {
      this.$emit("save-JSON-event");
      this.closeModal();
    },
    setJsonString(s) {
      this.jsonString = s;
    },
    downloadJson() {
      var dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(this.jsonString);
      var downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      if (this.fileName == "") {
        this.fileName = "LogicaSimulatorSave";
      }
      downloadAnchorNode.setAttribute("download", this.fileName + ".lsm");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    translateModal() {
      let langObj = null;
      let lang = store.getters["canvasStore/getCurrLanguage"];
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
  },
  mounted() {
    document.getElementById("form-body").addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("save-btn").click();
      }
    });
    this.translateModal();
  },
};
</script>

<style scoped>
/* Override default value of 'none' */
.modal {
  display: block;
}
.modal-body {
  max-height: 80vh;
  max-width: 80vw;
}
.inputtitle {
  font-weight: bold;
  padding-top: 1em;
}
</style>
