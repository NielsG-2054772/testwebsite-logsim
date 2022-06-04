<template>
  <div class="bootstrap-modal-no-jquery" :style="styleObject">
    <div class="modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="logicanalyzer" class="modal-title">Logic analyzer</h5>
          </div>
          <div id="chart-container" class="modal-body overflow-auto">
            <logic-analyzer-chart ref="chart" />
          </div>
          <div class="modal-footer">
            <button
              id="close-btn"
              type="button"
              class="btn btn-secondary"
              @click="emitToggle"
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
// eslint-disable-next-line no-unused-vars
import store from "../store/index.js";
import logicAnalyzerChart from "../components/logicAnalyzerChart.vue";
export default {
  name: "logicAnalyzerChartModal",
  components: { logicAnalyzerChart },
  data() {
    return {
      styleObject: {
        visibility: "hidden",
      },
    };
  },
  methods: {
    callUpdate() {
      this.$refs.chart.callUpdate();
    },
    emitToggle() {
      this.$emit("toggleAnalyzerModal-event");
    },
    closeModal() {
      this.styleObject.visibility = "hidden";
      var modal = document.getElementById("chart-container");
      modal.scrollTop = 0;
      this.$refs.chart.toggleLegend();
    },
    openModal() {
      this.styleObject.visibility = "visible";
      this.$refs.chart.toggleLegend();
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
          this.$refs.chart.translateModal();
        });
      }
    },
  },
};
</script>

<style scoped>
/* Override default value of 'none' */
.modal {
  display: block;
}
.modal-body {
  max-height: 50vh;
}
.inputtitle {
  font-weight: bold;
  padding-top: 1em;
}
</style>
