<template>
  <div class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="screenshot" class="modal-title">
              Screenshot van applicatie
            </h5>
          </div>
          <div id="form-body" class="modal-body overflow-auto">
            <p id="nameforfile">Name for the file:</p>
            <input v-model="imgName" />
            <img :src="this.imgSrc" />
          </div>
          <div class="modal-footer">
            <button
              id="multiple-save-btn"
              type="button"
              class="btn btn-primary"
              @click="saveMultipleImage"
            >
              Save as multiple images
            </button>
            <button
              id="save-btn"
              type="button"
              class="btn btn-success"
              @click="saveImage"
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
  name: "ImageModal",
  data() {
    return {
      imgSrc: 0,
      imgName: "LogicSimulatorScreenshot",
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-image-modal-event");
    },
    setPicture(img) {
      this.imgSrc = img;
    },
    saveImage() {
      if (this.imgName == "") {
        this.imgName = "LogicSimulatorScreenshot";
      }
      this.$emit("save-image-event", this.imgName);
      this.closeModal();
    },
    saveMultipleImage(){
      if (this.imgName == "") {
        this.imgName = "LogicSimulatorScreenshot";
      }
      this.$emit("save-multiple-image-event", this.imgName);
      this.closeModal();
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
    this.$emit("refresh-image-event");
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
