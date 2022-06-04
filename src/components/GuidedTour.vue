<template>
  <div id="container"></div>
</template>

<script>
export default {
  name: "GuideTour",
  data() {
    return {
      stepcount: 0,
      currStep: 0,
      ids: [],
      lang: "eng",
      langObj: null,
    };
  },
  methods: {
    startTour() {
      if (this.stepcount >= 0) {
        if (this.currStep < this.stepcount) {
          document.getElementById(this.ids[this.currStep]).hidden = true;
        }
        this.currStep = 0;
        document.getElementById(this.ids[this.currStep]).hidden = false;
      }
    },
    setuplang() {
      try {
        const file = require("../assets/languages/" + this.lang + ".json");
        this.langObj = JSON.parse(JSON.stringify(file));
      } catch (e) {
        console.log("error loading language file");
      }
    },
    getButtons() {
      var t = this;
      var btngroup = document.createElement("div");
      btngroup.className = "btn-group-vertical";
      btngroup.role = "group";
      btngroup.ariaLabel = "Basic example";
      var btngrouptop = document.createElement("div");
      btngrouptop.className = "btn-group";
      btngrouptop.role = "group";

      var btn1 = document.createElement("button");
      btn1.className = "btn btn-sm btn-outline-light";
      btn1.id = "btn1";
      btn1.innerHTML = this.langObj["next-btn"];
      btn1.type = "button";
      btn1.onclick = function () {
        t.nextStep();
      };

      var btn2 = document.createElement("button");
      btn2.className = "btn btn-sm btn-outline-light";
      btn2.id = "btn2";
      btn2.innerHTML = this.langObj["skip-btn"];
      btn2.type = "button";
      btn2.onclick = function () {
        t.skipSteps();
      };

      var btn3 = document.createElement("button");
      btn3.className = "btn btn-sm btn-outline-light";
      btn3.id = "btn3";
      btn3.innerHTML = this.langObj["prev-btn"];
      btn2.type = "button";
      btn3.onclick = function () {
        t.prevStep();
      };
      btngrouptop.appendChild(btn3);
      btngrouptop.appendChild(btn1);
      btngroup.appendChild(btngrouptop);
      btngroup.appendChild(btn2);
      return btngroup;
    },
    translate(lang) {
      this.lang = lang;
      this.setuplang();
      this.ids.forEach((id) => {
        if (Object.prototype.hasOwnProperty.call(this.langObj, id)) {
          document.getElementById(id).innerHTML = this.langObj[id];
          var btns = this.getButtons();
          document.getElementById(id).prepend(document.createElement("br"));
          document.getElementById(id).appendChild(document.createElement("br"));
          document.getElementById(id).appendChild(document.createElement("br"));
          document.getElementById(id).appendChild(btns);
        }
      });
    },
    addStep(id, posx, posy, lang, right) {
      var step = document.createElement("div");
      if (right) {
        step.className = "step";
      } else {
        step.className = "stepleft";
      }
      step.id = id;
      if (Object.prototype.hasOwnProperty.call(this.langObj, id)) {
        step.innerHTML = this.langObj[id];
      }
      if (this.lang != lang) {
        this.translate(lang);
      }

      step.prepend(document.createElement("br"));
      this.ids.push(id);
      if (right) {
        step.style.left = posx - 250 + "px";
      } else {
        step.style.left = posx + "px";
      }
      step.style.top = posy + "px";
      step.hidden = true;
      var btns = this.getButtons();
      step.appendChild(document.createElement("br"));
      step.appendChild(document.createElement("br"));
      step.appendChild(btns);
      document.getElementById("container").appendChild(step);
      this.stepcount++;
    },
    nextStep() {
      document.getElementById(this.ids[this.currStep]).hidden = true;
      this.currStep++;
      if (document.getElementById(this.ids[this.currStep])) {
        document.getElementById(this.ids[this.currStep]).hidden = false;
      } else {
        localStorage.setItem("guideDone", true);
      }
    },
    prevStep() {
      if (this.currStep > 0) {
        document.getElementById(this.ids[this.currStep]).hidden = true;
        this.currStep--;
        document.getElementById(this.ids[this.currStep]).hidden = false;
      }
    },
    skipSteps() {
      document.getElementById(this.ids[this.currStep]).hidden = true;
      this.currStep = 0;
      localStorage.setItem("guideDone", true);
    },
  },
  mounted: function () {
    this.setuplang();
  },
};
</script>

<style>
#container {
  height: 0;
  width: 0;
  padding: 0;
  margin: 0;
}
.stepleft {
  position: relative;
  width: 300px;
  color: white !important;
  background: #bb2124;
  border-radius: 40px;
  padding: 24px;
  text-align: center;
  color: #000;
  z-index: 9;
}

.stepleft:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-bottom: 24px solid transparent;
  border-top: 36px solid transparent;
  border-left: 0px solid #bb2124;
  border-right: 24px solid #bb2124;
  left: 10px;
  top: -20px;
}
.step {
  position: relative;
  width: 300px;
  color: white !important;
  background: #bb2124;
  border-radius: 40px;
  padding: 24px;
  text-align: center;
  color: #000;
  z-index: 9;
}

.step:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-bottom: 24px solid transparent;
  border-top: 36px solid transparent;
  border-right: 0px solid #bb2124;
  border-left: 24px solid #bb2124;
  left: 250px;
  top: -20px;
}
.step::after {
  z-index: 8;
}
</style>
