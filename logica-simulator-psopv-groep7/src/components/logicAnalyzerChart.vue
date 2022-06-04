<template>
  <div id="chart"></div>
  <!-- <input
    v-model="logicAnalyzerIndex"
    type="number"
    v-bind:max="this.getLogicAnalyzers.length"
    min="0"
  /-->
  <button id="clear-graph-btn" class="btn btn-danger" @click="clearData">
    Clear graph
  </button>
</template>

<script>
import store from "../store/index.js";
import * as c3 from "c3";
import "c3/c3.css";
export default {
  name: "logicAnalyzerChart",
  data() {
    return {
      str: "test",
      data: [["Click a title to toggle it!"]],
      calcNew: true,
      logicAnalyzerIndex: 0,
      chart: 0,
      showChart: false,
      localLangObj: null,
    };
  },
  methods: {
    clearData() {
      var newData = [];
      newData.push(["Click a title to toggle it!"]);
      for (let i = 0; i < this.getLogicAnalyserCount; i++) {
        newData.push([`LogicAnalyzer${this.getLogicAnalyzers[i].viewId}`]);
      }
      this.data = newData;
      this.chart = c3.generate({
        bindto: "#chart",
        axis: {
          y: {
            label: {
              text: "(0=LOW, 1=HIGH, 0.5=FLOATING)",
              position: "outer-center",
            },
            tick: {
              count: 2,
              values: [0, 1],
            },
          },
          x: {
            label: {
              text: "t",
              position: "outer-center",
            },
          },
        },
        data: {
          columns: this.data,
          type: "step",
        },
        legend: {
          show: this.showChart,
        },
        zoom: {
          enabled: true,
        },
      });
    },
    toggleLegend() {
      this.showChart = !this.showChart;
      if (this.showChart) {
        this.chart.legend.show();
        this.chart.load({
          columns: this.data,
        });
      } else {
        this.chart.legend.hide();
      }
    },
    callUpdate() {
      this.updateValues();
      if (this.showChart) {
        this.chart.load({
          columns: this.data,
        });
      }
    },
    updateValues() {
      for (let i = 0; i <= this.getLogicAnalyzers.length - 1; i++) {
        this.processNewInput(this.currentValues[i], i);
      }
    },
    processNewInput(newData, index) {
      let data;
      if (newData) {
        data = 1;
      } else if (newData == undefined) {
        data = 0.5;
      } else {
        data = 0;
      }
      try {
        this.data[index + 1].push(data);
      } catch (e) {
        document.location.reload(true);
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
        this.chart.internal.config.axis_y_label.text = langObj["y-axis"];
      }
    },
  },
  computed: {
    getLogicAnalyserIds() {
      return store.getters["canvasStore/getLogicAnalyserIds"];
    },
    getLogicAnalyzers() {
      return store.getters["simulationStore/componentStore/getLogicAnalysers"];
    },
    getLogicAnalyserCount() {
      return store.getters[
        "simulationStore/componentStore/getLogicAnalysercount"
      ];
    },
    currentLogicAnalyzerVals() {
      if (this.getLogicAnalyzers.length != 0) {
        return this.getLogicAnalyzers[this.logicAnalyzerIndex - 1].value;
      }
      return 0;
    },
    currentValues() {
      let currentVals = [];
      for (let i = 0; i <= this.getLogicAnalyzers.length - 1; i++) {
        // this.processNewInput(this.getLogicAnalyzers[i].value, i);
        currentVals.push(this.getLogicAnalyzers[i].value);
      }
      return currentVals;
    },
  },
  watch: {
    getLogicAnalyserCount() {
      this.clearData();
    },
  },
  mounted() {
    var t = this;
    this.chart = c3.generate({
      bindto: "#chart",
      axis: {
        y: {
          label: {
            text: "(0=LOW, 1=HIGH, 0.5=FLOATING)",
            position: "outer-center",
          },
          tick: {
            count: 2,
            values: [0, 1],
          },
        },
        x: {
          label: {
            text: "t",
            position: "outer-center",
          },
        },
      },
      data: {
        columns: t.data,
        type: "step",
      },
      legend: {
        show: this.showChart,
      },
      zoom: {
        enabled: true,
      },
    });
  },
};
</script>
