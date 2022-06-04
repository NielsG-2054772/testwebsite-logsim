<template>
  <div id="clockmodal" class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="clock-interval" class="modal-title">Clock interval</h5>
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
                      v-model="enteredTiming"
                      class="form-control"
                      id="timing"
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
              @click="saveTiming"
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
  name: "ClockModal",
  props: {
    posString: String,
    prevTiming: Number,
    propClockId: Number,
  },
  data() {
    return {
      enteredTiming: 0,
      clockId: 0,
      clockPosString: 0,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close-modal-event");
    },
    saveTiming() {
      if (document.getElementById("timing").value == "") {
        this.$parent.openErrorModal("error_emptyinput");
      } else {
        this.$emit(
          "component-timing-set-event",
          document.getElementById("timing").value,
          this.clockId,
          this.clockPosString
        );
        this.closeModal();

        this.enteredTiming = 0;
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
  },
  watch: {
    posString() {
      this.clockPosString = this.posString;
    },
    prevTiming() {
      this.enteredTiming = this.prevTiming;
    },
    propClockId() {
      this.clockId = this.propClockId;
    },
  },
  mounted() {
    this.enteredTiming = this.prevTiming;
    this.clockId = this.propClockId;
    this.clockPosString = this.posString;

    document.getElementById("form-body").addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("save-btn").click();
      }
    });
    this.translateModal();
    document
      .getElementById("clockmodal")
      .addEventListener("shown.bs.modal", () => {
        document.getElementById("input1").focus();
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
