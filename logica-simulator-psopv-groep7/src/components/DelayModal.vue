<template>
  <div class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="component-delay" class="modal-title">
              Delay for component
            </h5>
          </div>
          <div id="form-body" class="modal-body overflow-auto">
            <form>
              <div class="form-group">
                <label for="input1"
                  ><h4 id="timemilli">Time (milliseconds)</h4></label
                >
                <div class="row" id="input1">
                  <div class="col">
                    <input
                      type="number"
                      v-model="enteredDelay"
                      class="form-control"
                      id="delay"
                      step="100"
                      min="0"
                      @keypress="isNumber($event)"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              id="save-btn"
              type="button"
              class="btn btn-primary"
              @click="saveDelay"
            >
              Save
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
  name: "DelayModal",
  props: {
    prevDelay: Number,
  },
  data() {
    return {
      enteredDelay: 0,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-modal-event");
    },
    saveDelay() {
      if (document.getElementById("delay").value == "") {
        this.$parent.openErrorModal("error_emptyinput");
      } else {
        this.$emit(
          "component-delay-set-event",
          document.getElementById("delay").value
        );
        this.closeModal();
        this.enteredDelay = 0;
      }
    },
    isNumber(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
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
  watch: {
    prevDelay() {
      this.enteredDelay = this.prevDelay;
    },
  },
  mounted() {
    this.enteredDelay = this.prevDelay;
    this.translateModal();
    document.getElementById("form-body").addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("save-btn").click();
      }
    });
  },
};
</script>

<style scoped>
/* Override default value of 'none' */
.modal {
  display: block;
}
.modal-body {
  max-height: 30vh;
}
.inputtitle {
  font-weight: bold;
  padding-top: 1em;
}
</style>
