<template>
  <div class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="error-detected" class="modal-title">Error detected!</h5>
          </div>
          <div id="form-body" class="modal-body overflow-auto">
            <p>Error: {{ this.errorMsg }}</p>
          </div>
          <div class="modal-footer">
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
  name: "ErrorModal",
  data() {
    return {
      errorMsg: "no errors yet",
    };
  },
  methods: {
    setErrorMsg(msg) {
      this.errorMsg = msg;
    },
    closeModal() {
      this.$emit("close-error-modal-event");
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
    this.$emit("refresh-error-modal-event");
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
