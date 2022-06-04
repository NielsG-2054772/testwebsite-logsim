<template>
  <div class="truthTable">
    <h4 id="component-title">
      {{ currentTitle }}
    </h4>

    <p id="emptyDesc">{{ currentDescription }}</p>
    <div id="table">
      <tr v-for="row in truthTable" :key="row">
        <td v-for="input in row[0]" :key="input">
          {{ input }}
        </td>
        <td class="outputrow">
          {{ row[1] }}
        </td>
      </tr>
    </div>
  </div>
</template>

<script>
import store from "../store/index.js";

export default {
  computed: {
    truthTable() {
      // this is so we can use the refresh function to refresh truth table
      this.refreshKey;
      return store.getters["simulationStore/componentStore/getTruthTable"](
        this.currentComponent
      );
    },
    currentComponent() {
      return store.getters["canvasStore/getCurrent"];
    },

    currentTitle() {
      this.currLanguage();
      if (this.langObj !== null) {
        if (this.currentComponent === undefined) {
          return "";
        }
        if (
          this.currentComponent == "wiring1" ||
          this.currentComponent == "wiring2"
        ) {
          return this.langObj["wiringTitle"];
        }
        if (this.langObj[this.currentComponent + "Title"] !== undefined) {
          return this.langObj[this.currentComponent + "Title"];
        }
        return "";
      }
      this.loadLanguage();
      return this.currentTitle;
    },
    currentDescription() {
      this.currLanguage();
      if (this.langObj !== null) {
        if (
          this.currentComponent == "wiring1" ||
          this.currentComponent == "wiring2"
        ) {
          this.updateID("wiringDesc");
          return this.langObj["wiringDesc"];
        }
        if (this.langObj[this.currentComponent + "Desc"] !== undefined) {
          this.updateID(this.currentComponent + "Desc");
          return this.langObj[this.currentComponent + "Desc"];
        } else {
          this.updateID("emptyDesc");
          return this.langObj["emptyDesc"];
        }
      } else {
        this.loadLanguage();
        return this.currentDescription;
      }
    },
  },

  methods: {
    refreshTruthTable() {
      this.refreshKey = !this.refreshKey;
      this.currentDescription();
      this.currentTitle();
    },
    loadLanguage() {
      try {
        this.lastLang = store.getters["canvasStore/getCurrLanguage"];

        const file = require("../assets/languages/" + this.lastLang + ".json");
        this.langObj = JSON.parse(JSON.stringify(file));
      } catch (e) {
        console.log("error loading language file");
      }
    },
    updateID(newId) {
      if (document.getElementById(this.currID) !== null) {
        document.getElementById(this.currID).id = newId;
        this.currID = newId;
      }
    },
    currLanguage() {
      if (this.lastLang !== store.getters["canvasStore/getCurrLanguage"]) {
        this.loadLanguage();
      }
      return store.getters["canvasStore/getCurrLanguage"];
    },
  },

  data() {
    return {
      refreshKey: true,
      langObj: null,
      lastLang: "nolang",
      currID: "emptyDesc",
    };
  },

  mounted() {
    this.loadLanguage();
  },
};
</script>

<style scoped>
table,
td,
tr {
  border: 1px solid black;
}
#table {
  justify-content: center;
  padding-left: 50px;
}
table {
  align-self: center;
}
p {
  max-width: 200px;
}

#title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 0px;
}

td {
  padding-left: 10px;
  padding-right: 10px;
}

.outputrow {
  font-weight: bold;
}
</style>
