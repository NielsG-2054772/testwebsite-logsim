<template>
  <div class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="startnew" class="modal-title">Start new circuit</h5>
          </div>
          <div id="form-body" class="modal-body overflow-auto">
            <h6 id="confirmnew">
              Are you sure that you want to delete the current circuit?
            </h6>
          </div>
          <div class="modal-footer">
            <button
              id="clear-btn"
              type="button"
              class="btn btn-primary"
              @click="closeModal"
            >
              Clear circuit
            </button>
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
              @click="closeNoReset"
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
  name: "NewModal",
  data() {
    return {};
  },
  methods: {
    closeModal() {
      this.$emit("reset-close-event");
    },
    closeNoReset() {
      this.$emit("close-modal-event");
    },
    saveCircuit() {
      this.closeNoReset();
      this.$emit("save-event");
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
