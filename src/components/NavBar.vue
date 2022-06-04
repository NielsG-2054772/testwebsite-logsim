<template>
  <!-- bootstrap navbar with dropdown menus -->
  <nav class="navbar navbar-dark bg-success navbar-expand-lg nav-fill w-100">
    <div
      class="container-fluid navbar-inner"
      max-height="0.8*window.screen.height"
    >
      <a class="navbar-brand" id="title" href="#">Logic simulator</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="fileDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              File
            </a>
            <ul class="dropdown-menu" aria-labelledby="fileDropdown">
              <li>
                <a id="new" class="dropdown-item" href="#" @click="newClick"
                  >New...</a
                >
              </li>
              <li>
                <a id="save" class="dropdown-item" href="#" @click="saveClick"
                  >Save</a
                >
              </li>
              <li>
                <a id="load" class="dropdown-item" href="#" @click="loadClick"
                  >Load</a
                >
              </li>
              <li>
                <button
                  id="imageModal"
                  class="dropdown-item"
                  href="#"
                  @click="imageModalClick"
                >
                  Image maker
                </button>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="extrasDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Extras
            </a>
            <ul class="dropdown-menu" aria-labelledby="extrasDropdown">
              <li>
                <button
                  id="logicanalyzer"
                  class="dropdown-item"
                  href="#"
                  @click="logicanalyzerClick"
                >
                  Logic analyzer
                </button>
              </li>
              <li>
                <button
                  id="guidedTour"
                  class="dropdown-item"
                  href="#"
                  @click="guideClick"
                >
                  Guided tour
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ul class="navbar-nav flex-row flex-wrap ms-md-auto">
        <div class="dropdown">
          <li class="nav-item col-5 col-md-auto btn-sm">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="language-select"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ENG
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="language-select"
            >
              <li>
                <a class="dropdown-item" @click="setLanguages('nl')" href="#"
                  >NL</a
                >
              </li>
              <li>
                <a class="dropdown-item" @click="setLanguages('eng')" href="#"
                  >ENG</a
                >
              </li>
            </ul>
          </li>
        </div>
      </ul>
    </div>
  </nav>
</template>

<script>
import store from "../store/index.js";
export default {
  name: "NavBar",
  props: {},
  data() {
    return {
      mode: "edit",
    };
  },
  methods: {
    guideClick() {
      this.$parent.startGuide();
    },
    logicanalyzerClick() {
      store.commit("canvasStore/setOpenLogicAnalyzer", true);
    },
    imageModalClick() {
      store.commit("canvasStore/setOpenImageModal", true);
    },
    saveClick() {
      store.commit("canvasStore/setSaveLoadWatcher", "save");
    },
    loadClick() {
      store.commit("canvasStore/setSaveLoadWatcher", "load");
    },
    newClick() {
      this.$parent.newCanvas();
    },
    switchMode(mode) {
      this.mode = mode;
    },
    setLanguages(lang) {
      this.$parent.setLanguage(lang);
      document.getElementById("language-select").innerHTML = lang.toUpperCase();
    },
    setLanguage(lang) {
      let langObj = null;
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
    document.getElementById("language-select").innerHTML =
      store.getters["canvasStore/getCurrLanguage"].toUpperCase();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropdown-menu {
  white-space: nowrap;
}
.dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0;
}
</style>
