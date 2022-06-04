<template>
  <div class="bootstrap-modal-no-jquery">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="setisvalues" class="modal-title">
              Set input sequencer values
            </h5>
          </div>
          <div id="form-body" class="modal-body overflow-auto"></div>
          <div class="modal-footer">
            <button
              id="add-btn"
              type="button"
              class="btn btn-success"
              @click="addValue"
            >
              Add value
            </button>
            <button
              id="save-btn"
              type="button"
              class="btn btn-primary"
              @click="saveChanges"
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
  data() {
    return {
      numInputs: 0,
      isPosString: "",
      values: [],
      isId: 0,
    };
  },
  props: {
    posString: String,
    prevValues: Array,
    prevInputSequencerId: Number,
  },
  watch: {
    posString() {
      this.isPosString = this.posString;
    },
    prevValues() {
      this.updateValues();
    },
    prevInputSequencerId() {
      this.isId = this.prevInputSequencerId;
    },
  },
  methods: {
    closeModal() {
      this.$emit("close-modal-event");
    },
    addValue() {
      this.numInputs++;
      document
        .getElementById("form-body")
        .insertAdjacentHTML(
          "beforeEnd",
          ' <div class="form-group" id="row' +
            this.numInputs +
            '"> <label style="padding-top: 1em" class="inputtitle" for="input' +
            this.numInputs +
            '"><h4 id="text' +
            this.numInputs +
            '">Input ' +
            this.numInputs +
            '</h4></label> <div class="row" id="input' +
            this.numInputs +
            '"> <div class="col"> <label id="selectlabel' +
            this.numInputs +
            '" for="select' +
            this.numInputs +
            '">Value</label> <select class="form-control" id="select' +
            this.numInputs +
            '"> <option value="0">False</option> <option value="1">True</option> </select> </div> <div class="col"> <label id="timelabel' +
            this.numInputs +
            '" for="time' +
            this.numInputs +
            '">Time (ms)</label> <input type="number" class="form-control" id="time' +
            this.numInputs +
            '" step="100" min="0" value="100" /></div><div class="col"></br><button type="button" id="delete' +
            this.numInputs +
            '" class="btn btn-danger"><i class="bi bi-trash text-light"></i></button></div> </div> </div>'
        );
      document
        .getElementById("time" + this.numInputs)
        .addEventListener("keypress", this.isNumber);
      let inp = this.numInputs;
      let t = this;
      document
        .getElementById("delete" + this.numInputs)
        .addEventListener("click", function () {
          t.deleteValue(inp);
        });
      if (this.numInputs > 1) {
        document.getElementById("select" + this.numInputs).value =
          document.getElementById("select" + (this.numInputs - 1)).value == "1"
            ? "0"
            : "1";
      }
      this.translateModal();
    },

    deleteValue(num) {
      if (this.numInputs == 1) {
        this.$parent.openErrorModal("error_deletelastinput");
      } else {
        document.getElementById("row" + num).remove();
        var currId = 1;
        for (let i = 0; i < this.numInputs; i++) {
          if (document.getElementById("row" + (i + 1)) != null) {
            document.getElementById("row" + (i + 1)).id = "row" + currId;
            console.log(document.getElementById("text" + (i + 1)));
            document.getElementById("text" + (i + 1)).innerHTML =
              "Input" + currId;
            document.getElementById("text" + (i + 1)).id = "text" + currId;
            document.getElementById("input" + (i + 1)).id = "input" + currId;
            document.getElementById("select" + (i + 1)).id = "select" + currId;
            document.getElementById("time" + (i + 1)).id = "time" + currId;
            document.getElementById("delete" + (i + 1)).id = "delete" + currId;
            document.getElementById("selectlabel" + (i + 1)).id =
              "selectlabel" + currId;
            document.getElementById("timelabel" + (i + 1)).id =
              "timelabel" + currId;
            currId++;
          }
        }
        this.numInputs--;
        this.translateModal();
      }
    },
    emptyField() {
      for (let i = 1; i <= this.numInputs; i++) {
        if (document.getElementById("time" + i).value == "") {
          return true;
        }
      }
    },

    saveChanges() {
      if (this.emptyField()) {
        this.$parent.openErrorModal("error_emptyinput");
      } else {
        this.values = [];
        //get all values from input en put in values array
        for (var i = 1; i <= this.numInputs; i++) {
          var value = document.getElementById("select" + i).value === "1";
          var time = parseInt(document.getElementById("time" + i).value);
          this.values.push({ timing: time, value: value });
        }
        this.$emit(
          "input-sequencer-values-event",
          this.values,
          this.isId,
          this.isPosString
        );
        this.closeModal();
      }
    },
    updateValues() {
      document.getElementById("form-body").innerHTML = "";
      if (this.prevValues !== undefined) {
        for (var i = 0; i < this.prevValues.length; i++) {
          this.addValue();
          document.getElementById("select" + (i + 1)).value = this.prevValues[i]
            .value
            ? 1
            : 0;
          document.getElementById("time" + (i + 1)).value =
            this.prevValues[i].timing;
        }
        this.numInputs = this.prevValues.length;
        this.values = this.prevValues;
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
      console.log("translating");
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
        for (let i = 1; i <= this.numInputs; i++) {
          if (document.getElementById("row" + i) != null) {
            document.getElementById("text" + i).innerHTML =
              langObj["valueInput"] + " " + i;
            console.log(document.getElementById("selectlabel" + i));
            document.getElementById("selectlabel" + i).innerHTML =
              langObj["valueInput"];
            document.getElementById("timelabel" + i).innerHTML =
              langObj["timemilli"];
          }
        }
      }
    },
  },
  mounted() {
    this.numInputs = 0;
    this.isPosString = this.posString;
    this.updateValues();
    this.isId = this.prevInputSequencerId;

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
  max-height: 30vh;
}
.inputtitle {
  font-weight: bold;
  padding-top: 1em;
}
</style>
