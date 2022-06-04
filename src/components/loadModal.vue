<template>
  <div class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="loadcircuit" class="modal-title">Load a circuit</h5>
          </div>
          <div id="form-body" class="modal-body overflow-auto">
            <h6 id="lsmfile">
              Please select a .lsm file compatible with the application
            </h6>
            <input
              class="form-control"
              type="file"
              id="fileUpload"
              accept=".lsm"
            /><br /><br />
            <h6 id="incompatiblefile" v-if="this.readError" class="text-danger">
              Error: file is not compatible with the application
            </h6>
          </div>
          <div class="modal-footer">
            <button
              id="load-btn"
              type="button"
              class="btn btn-success"
              @click="loadCircuit"
            >
              Load
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
  name: "LoadModal",
  data() {
    return {
      jsonFile: 0,
      jsonString: "",
      readError: false,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-load-modal-event");
    },
    loadCircuit() {
      var [file] = document.getElementById("fileUpload").files;

      // this.readError = true;
      //   this.$emit("load-JSON-event");
      var fr = new FileReader();
      if (file) {
        fr.readAsText(file);
        var t = this;
        fr.onload = function () {
          t.$emit("load-JSON-event", fr.result);
        };
      }
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
      if (e.keycode === 13) {
        e.preventDefault();
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
