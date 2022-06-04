import store from "../../store/index.js";
import IntersectionChecker from "../IntersectionChecker.js";
export default {
  methods: {
    /**
     * Draws the needed components and wires on the maincanvas
     * @param {*} mousePos: The mouse position
     */
    drawContent(mousePos) {
      mousePos.x = mousePos.x - (mousePos.x % this.canvas.gridInterval);
      mousePos.y = mousePos.y - (mousePos.y % this.canvas.gridInterval);
      this.drawGrid();
      this.ctxMainCanv.scale(this.scale.scaleX, this.scale.scaleY);
      for (var i of this.components.values()) {
        var r = i;
        if (
          //check of het getekend moet worden
          (r.x >= this.canvas.xOffset &&
            r.x <
              this.canvas.xOffset +
                this.canvas.canvWidth / this.zoom.scaleFactor &&
            r.y >= this.canvas.yOffset &&
            r.y <
              this.canvas.yOffset +
                this.canvas.canvHeight / this.zoom.scaleFactor) ||
          r.isDragging //Of kijk of deze gedragged wordt(anders wordt deze pas terug getoond bij het teruggaan naar zijn vorige plaats)
        ) {
          if (
            r.isDragging &&
            !this.components.has(`${mousePos.x}-${mousePos.y}`)
          ) {
            this.changeKey(`${mousePos.x}-${mousePos.y}`, `${r.x}-${r.y}`);
            if (r.type == "LED") {
              this.leds.get(r.id).x = mousePos.x;
              this.leds.get(r.id).y = mousePos.y;
            }
            r.x = mousePos.x;
            r.y = mousePos.y;
          }
          this.ctxMainCanv.fillStyle = r.fillStyle;
          this.drawComponent(r, r.type);
        }
      }
      this.drawWires();
    },
    /**
     * Calls drawWires for all wires
     */
    drawWires() {
      for (var i of this.wires.values()) {
        if (i.path != 0) {
          this.drawWire(i.path, i.wireId);
        }
      }
    },
    /**
     * Draws a wire with path and wireId
     * @param {} path: path to draw
     * @param {*} wireId : wire id of wire with path
     */
    drawWire(path, wireId) {
      this.ctxMainCanv.lineWidth = 8;
      this.ctxMainCanv.strokeStyle = "black";
      this.ctxMainCanv.stroke(path);

      var val;
      if (
        store.getters["simulationStore/componentStore/hasWireOfId"]({
          id: wireId,
        })
      ) {
        val = store.getters["simulationStore/componentStore/getWire"]({
          id: wireId,
        }).value;
        if (val) {
          val = "lime";
        } else if (val === false) {
          val = "red";
        } else {
          val = "#0771FA";
        }
      } else {
        val = "yellow";
      }

      this.ctxMainCanv.strokeStyle = val;
      this.ctxMainCanv.lineWidth = 3;
      this.ctxMainCanv.stroke(path);
      this.ctxMainCanv.strokeStyle = "black";
      this.ctxMainCanv.lineWidth = 1;
    },
    /**
     *
     * @param {*} path
     */
    drawTempWire(path) {
      this.ctxMainCanv.lineWidth = 5;
      this.ctxMainCanv.strokeStyle = "black";
      this.ctxMainCanv.stroke(path);
      this.ctxMainCanv.strokeStyle = "black";
      this.ctxMainCanv.lineWidth = 1;
    },
    /**
     * function that clears the maincanvas and draws all components, wires and the grid.
     * @param {} mousePos: position of the mouse
     */
    drawMain(mousePos) {
      this.ctxMainCanv.clearRect(
        0,
        0,
        this.canvas.canvWidth / this.zoom.scaleFactor,
        this.canvas.canvHeight / this.zoom.scaleFactor
      );
      this.ctxMainCanv.beginPath();
      this.ctxMainCanv.rect(
        0,
        0,
        this.canvas.canvWidth / this.zoom.scaleFactor,
        this.canvas.canvHeight / this.zoom.scaleFactor
      );
      this.ctxMainCanv.fillStyle = "white";
      this.ctxMainCanv.fill();
      this.intersectionChecker = new IntersectionChecker();
      this.renewPaths();
      this.renewPaths();
      this.drawContent(mousePos);
    },
    /**
     * Function that draws the grid
     */
    drawGrid() {
      this.ctxMainCanv.beginPath();
      this.ctxMainCanv.fillStyle = "#000000";
      for (
        var i = 0;
        i < this.canvas.canvWidth / this.zoom.scaleFactor;
        i += 10
      ) {
        for (
          var j = 0;
          j < this.canvas.canvHeight / this.zoom.scaleFactor;
          j += 10
        ) {
          if (
            i % this.canvas.gridInterval == 0 &&
            j % this.canvas.gridInterval == 0
          ) {
            this.ctxMainCanv.fillRect(i, j, 2, 2);
          } else {
            this.ctxMainCanv.rect(i, j, 1, 1);
          }
        }
      }
      this.ctxMainCanv.fillStyle = "#00FF00";
      this.ctxMainCanv.fill();
      this.ctxMainCanv.fillStyle = "#000000";
    },
    /**
     * Function that draws the grid for 1 specific point
     */
    drawGridAt(x, y) {
      this.ctxMainCanv.beginPath();
      for (var i = x; i <= x + this.canvas.gridInterval; i += 10) {
        for (var j = y; j <= y + this.canvas.gridInterval; j += 10) {
          if (
            i % this.canvas.gridInterval == 0 &&
            j % this.canvas.gridInterval == 0
          ) {
            this.ctxMainCanv.fillRect(i, j, 2, 2);
          } else {
            this.ctxMainCanv.rect(i, j, 1, 1);
          }
        }
      }
      this.ctxMainCanv.fillStyle = "#00FF00";
      this.ctxMainCanv.fill();
      this.ctxMainCanv.fillStyle = "#000000";
      this.ctxMainCanv.closePath();
    },
    /**
     * Function that draws a rectangle around a specific point
     * @param {*} x : x coordinate of the point
     * @param {*} y : y coordinate of the point
     * @param {*} color :color of the rectangle
     */
    drawComponentRect(x, y, color) {
      this.ctxMainCanv.beginPath();
      this.ctxMainCanv.rect(
        x - (x % this.canvas.gridInterval) - this.canvas.xOffset,
        y - (y % this.canvas.gridInterval) - this.canvas.yOffset,
        this.canvas.gridInterval,
        this.canvas.gridInterval
      );
      this.ctxMainCanv.strokeStyle = color;
      this.ctxMainCanv.stroke();
      this.ctxMainCanv.closePath();
      this.ctxMainCanv.strokeStyle = color;
    },
    /**
     * Function that draws a component
     * @param {*} r : data of the component
     * @param {*} type : type of the component
     */
    drawComponent(r, type) {
      //draws component r of type on canvas
      if (type == "pin" || type == "LED") {
        switch (
          store.getters["simulationStore/componentStore/getValueOfPinOrLed"]({
            id: r.id,
          })
        ) {
          case true:
            if (type == "LED") {
              type = "led-on";
            } else {
              type = "pinTrue";
            }

            break;
          case false:
            if (type == "LED") {
              type = "led-off";
            } else {
              type = "pinFalse";
            }
            break;
          case undefined:
            if (type == "LED") {
              type = "led-off";
            } else {
              type = "pinUndefined";
            }
            break;
        }
      }
      this.ctxMainCanv.drawImage(
        document.getElementById(type),
        r.x + 2 - this.canvas.xOffset,
        r.y - this.canvas.yOffset,
        this.canvas.gridInterval,
        this.canvas.gridInterval
      );
      if (
        this.componentArrays.noDelays.indexOf(r.type) === -1 &&
        !this.currentDragging &&
        this.componentArrays.currentAllowed.indexOf(
          this.getCurrentComponent
        ) !== -1
      ) {
        var delay = 0;
        if (r.type === "clock") {
          delay = store.getters[
            "simulationStore/componentStore/getClockTiming"
          ]({
            id: r.id,
          });
        } else {
          delay = store.getters[
            "simulationStore/componentStore/getComponentDelay"
          ]({
            id: r.id,
          });
        }
        if (delay === undefined) {
          delay = "";
        }
        this.ctxMainCanv.fillText(
          `${delay} ms`,
          r.x -
            this.canvas.xOffset +
            this.canvas.gridInterval -
            (2 * this.canvas.gridInterval) / 3 -
            delay.toString().length * 2,
          r.y +
            this.canvas.gridInterval -
            this.canvas.yOffset +
            this.canvas.gridInterval / 10
        );
      } else if (r.type == "logic-analyser") {
        this.ctxMainCanv.fillText(
          `# ${r.logicAnalyserId}`,
          r.x -
            this.canvas.xOffset +
            this.canvas.gridInterval -
            (2 * this.canvas.gridInterval) / 3,
          r.y +
            this.canvas.gridInterval -
            this.canvas.yOffset +
            this.canvas.gridInterval / 10
        );
      }
      if (r.isDragging && this.getCurrentComponent != "deleting") {
        this.drawComponentRect(r.x, r.y, "#0000FF");
      } else if (
        this.getCurrentComponent == "wiring2" &&
        this.wires.has(this.highestWireId) &&
        this.wires.get(this.highestWireId).idFrom == r.id
      ) {
        this.drawComponentRect(r.x, r.y, "#FF0000");
      }
    },

    /**
     * Function that draws the component in a lighter shade for use during placement.
     * @param {*} r component to draw
     */
    drawTemp(r) {
      let xTemp = r.x - (r.x % this.canvas.gridInterval) - this.canvas.xOffset;
      let yTemp = r.y - (r.y % this.canvas.gridInterval) - this.canvas.yOffset;
      if (xTemp != this.currTemp.x || yTemp != this.currTemp.y) {
        if (this.currTemp.x != undefined && this.currTemp.y != undefined) {
          this.ctxMainCanv.clearRect(
            this.currTemp.x - 1,
            this.currTemp.y - 1,
            this.canvas.gridInterval + 2,
            this.canvas.gridInterval + 2
          );
          this.drawGridAt(this.currTemp.x, this.currTemp.y);
          this.drawWires();
        }
        if (
          this.componentExistsAt(
            xTemp + this.canvas.xOffset,
            yTemp + this.canvas.yOffset
          )
        ) {
          this.currTemp.x = undefined;
          this.currTemp.y = undefined;
        } else {
          this.currTemp.x = xTemp;
          this.currTemp.y = yTemp;
        }
        this.ctxMainCanv.beginPath();
        if (
          this.currTemp.x != undefined &&
          this.currTemp.y != undefined &&
          this.getCurrentComponent != "deleting"
        ) {
          if (this.getCurrentComponent == "empty") {
            //verplaatsen
            this.ctxMainCanv.globalAlpha = 0.25;
            this.drawComponent(
              {
                x: xTemp + this.canvas.xOffset,
                y: yTemp + this.canvas.yOffset,
              },
              this.currentDraggingComponent.type
            );
            this.ctxMainCanv.globalAlpha = 1;
            //} else if (this.getCurrentComponent == "wiring2") {
            //   // tried to draw wire to mouse pos when wiring, failed miserably
            //   // this.wires.get(this.highestWireId).path = this.makeTempPath({
            //   //     x: xTemp + this.canvas.xOffset,
            //   //     y: yTemp + this.canvas.yOffset,
            //   //   },);
            //   let currWire = this.wires.get(this.highestWireId);
            //   currWire.path = this.makeTempPath({
            //     x: r.x + this.canvas.xOffset,
            //     y: r.y + this.canvas.yOffset,
            //   });
            //   this.drawTempWire(currWire.path);
          } else {
            this.ctxMainCanv.globalAlpha = 0.25;
            this.drawComponent(
              //plaatsen
              {
                x: xTemp + this.canvas.xOffset,
                y: yTemp + this.canvas.yOffset,
              },
              this.getCurrentComponent
            );
            this.ctxMainCanv.globalAlpha = 1;
          }
        }
        this.ctxMainCanv.strokeStyle = "blue";
        this.ctxMainCanv.stroke();
        this.ctxMainCanv.strokeStyle = "#000000";
        this.ctxMainCanv.closePath();
      }
    },
  },
};
