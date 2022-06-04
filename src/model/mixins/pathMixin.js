export default {
  methods: {
    /**
     * Function that decides which type of path needs to be made and calls the correct function to make that path
     * @returns: path2D object for the correct path
     */
    makePath(entryFrom, entryTo, wireId) {
      if (
        this.components.get(entryFrom).id == this.components.get(entryTo).id
      ) {
        return this.makeSelfPath(
          entryFrom,
          entryTo,
          wireId
        );
        // return this.makeSelfPath(entryFrom, entryTo, wireId);
      } else if (this.wires.get(wireId).isCustom) {
        return this.makeCustomPath(
          entryFrom,
          entryTo,
          wireId
        );
        // return this.makeCustomPath(entryFrom, entryTo, wireId);
      } else if (
        this.components.get(entryFrom).x < this.components.get(entryTo).x
      ) {
        return this.makeForwardPath(
          entryFrom,
          entryTo,
          wireId
        );
        // return this.makeForwardPath(entryFrom, entryTo, wireId);
      } else if (
        this.components.get(entryFrom).x >= this.components.get(entryTo).x
      ) {
        return this.makeRevPath(
          entryFrom,
          entryTo,
          wireId
        );
        // return this.makeRevPath(entryFrom, entryTo, wireId);
      }
    },
    /**
     * Function that renews paths for all wires
     */
    renewPaths() {
      this.canvas.wirePath = new Path2D();
      for (var i of this.wires.values()) {
        if (i.entryTo != undefined) {
          i.path = this.makePath(i.entryFrom, i.entryTo, i.wireId);
        } else {
          i.path = this.makeCustomPrevPath(i);
        }
      }
    },
    /**
 * Function that checks for collision problems in the hashmap
     * @param xMid:the middle of the path
     * @param yLow: the lowest point of the middle of the path
     * @param yHigh: the highest point of the middle of the path
     * @param xStart: x value the start of the path
     * @param xEnd: x value the end of the path
 */
    checkCollision(xMid, yLow, yHigh, xStart, xEnd) {

      xMid = xMid + this.canvas.xOffset;
      yLow = yLow + this.canvas.yOffset;
      yHigh = yHigh + this.canvas.yOffset;
      var rightCollisions = this.checkRightCollision(xMid, yLow, yHigh, xEnd);
      if (rightCollisions != -1) {
        return rightCollisions;
      }
      var leftCollisions = this.checkLeftCollision(xMid, yLow, yHigh, xStart);
      if (leftCollisions != -1) {
        return -leftCollisions;
      }
      return 0;
    },
    /**
     * Function that checks for collision on the lef hand side of the middle of the path
     * @param xMid:the middle of the path
     * @param yLow: the lowest point of the middle of the path
     * @param yHigh: the highest point of the middle of the path
     * @param xStart: x value the start of the path
     */
    checkLeftCollision(xMid, yLow, yHigh, xStart) {
      // let sum = false;
      let collisions = 0;
      // if (pointA.y > pointB.y) sum = true;
      var pointToCheck = {
        x: xMid - (xMid % this.canvas.gridInterval),
        y: yLow - (yLow % this.canvas.gridInterval),
      };
      let collided;
      let posString;
      while (pointToCheck.y < yHigh) {
        collided = false;
        while (!collided && pointToCheck.y < yHigh) {
          posString = `${pointToCheck.x - (pointToCheck.x % this.canvas.gridInterval)
            }-${pointToCheck.y - (pointToCheck.y % this.canvas.gridInterval)}`;
          if (this.components.has(posString)) {
            collisions++;
            collided = true;
            pointToCheck.x -= this.canvas.gridInterval;
            pointToCheck.y = yLow - (yLow % this.canvas.gridInterval);
          } else {
            pointToCheck.y += this.canvas.gridInterval;
          }
        }
      }

      if (xMid - (collisions) * this.canvas.gridInterval < xStart) {
        return -1;
      }
      return collisions;
    },
    /**
     * Function that checks for collision on the right hand side of the middle of the path
     * @param xMid:the middle of the path
     * @param yLow: the lowest point of the middle of the path
     * @param yHigh: the highest point of the middle of the path
     * @param xEnd: x value the end of the path
     */
    checkRightCollision(xMid, yLow, yHigh, xEnd) {
      let collisions = 0;
      var pointToCheck = {
        x: xMid - (xMid % this.canvas.gridInterval),
        y: yLow - (yLow % this.canvas.gridInterval),
      };
      let collided;
      let posString;
      while (pointToCheck.y < yHigh) {
        collided = false;
        while (!collided && pointToCheck.y < yHigh) {
          posString = `${pointToCheck.x - (pointToCheck.x % this.canvas.gridInterval)
            }-${pointToCheck.y - (pointToCheck.y % this.canvas.gridInterval)}`;
          if (this.components.has(posString)) {
            collisions++;
            collided = true;
            pointToCheck.x += this.canvas.gridInterval;
            pointToCheck.y = yLow - (yLow % this.canvas.gridInterval);
          } else {
            pointToCheck.y += this.canvas.gridInterval;
          }
        }
      }
      if (xMid + (collisions) * this.canvas.gridInterval > xEnd) {
        return -1;
      }
      return collisions;
    },
    /**
     * Function that calculates the end of a path
     * @param {} componentTo the component where the path ends
     * @param {*} wireId the id of the wire
     * @returns 
     */
    calcYEnd(componentTo, wireId) {
      let yEnd = 0;
      if (
        componentTo.type == "not-gate" ||
        componentTo.type == "logic-analyser" ||
        componentTo.type == "LED"
      ) {
        yEnd =
          componentTo.y + this.canvas.gridInterval / 2 - this.canvas.yOffset;
      } else if (componentTo.inWireIds[0] == wireId) {
        yEnd =
          componentTo.y + this.canvas.gridInterval / 3 - this.canvas.yOffset;
      } else {
        yEnd =
          componentTo.y +
          (this.canvas.gridInterval - this.canvas.gridInterval / 3) -
          this.canvas.yOffset;
      }
      return yEnd;
    },
    /**
     * Function that calculates the start of a path
     * @param {} componentFrom the component where the path Starts
     * @param {*} wireId the id of the wire
     * @returns 
     */
    calcYStart(componentFrom, wireId) {
      var yStart = componentFrom.y + this.canvas.gridInterval / 2 - this.canvas.yOffset;
      if (this.componentArrays.multipleOutputs.indexOf(componentFrom.type) !== -1) {
        if (this.wires.get(wireId).outTop) {
          yStart = componentFrom.y + this.canvas.gridInterval / 3 - this.canvas.yOffset;
        }
        else {
          yStart = componentFrom.y +
            (this.canvas.gridInterval - this.canvas.gridInterval / 3) -
            this.canvas.yOffset;
        }
      }
      return yStart;
    },
    /**
     * Function that makes a regular path in which the starting point has a lower x value that the ending point
    * @param entryFrom: the entry of the component where the path starts
     * @param entryTo: the entry of the component where the path ends
     * @param wireId: the id of the wire to make a path for 
    * Returns path2D object for the correct path
     */
    makeForwardPath(entryFrom, entryTo, wireId) {
      var path = new Path2D();
      let componentFrom = this.components.get(entryFrom);
      let componentTo = this.components.get(entryTo);
      let xMid =
        componentFrom.x -
        this.canvas.xOffset +
        (componentTo.x +
          this.canvas.gridInterval -
          this.canvas.xOffset -
          (componentFrom.x - this.canvas.xOffset)) /
        2;
      let yEnd = this.calcYEnd(componentTo, wireId);
      let yStart = this.calcYStart(componentFrom, wireId);
      //collisions for autorouting
      if (
        ((componentTo.x - componentFrom.x) / this.canvas.gridInterval) % 2 ==
        0
      ) {
        if (componentFrom.y < componentTo.y) {
          xMid +=
            this.checkCollision(
              xMid,
              componentFrom.y +
              this.canvas.gridInterval / 2 -
              this.canvas.yOffset,
              yEnd,
              componentFrom.x,
              componentTo.x
            ) * this.canvas.gridInterval;
        } else if (componentFrom.y > componentTo.y) {
          xMid +=
            this.checkCollision(
              xMid,
              yEnd,
              componentFrom.y +
              this.canvas.gridInterval / 2 -
              this.canvas.yOffset,
              componentFrom.x,
              componentTo.x
            ) * this.canvas.gridInterval;
        }
      }
      path.moveTo(
        //start
        componentFrom.x + this.canvas.gridInterval - this.canvas.xOffset,
        yStart
      );
      this.checkIntersection(path, componentFrom.x + this.canvas.gridInterval - this.canvas.xOffset,
        yStart, xMid, yStart);
      path.lineTo(
        xMid,
        yStart
      );
      path.lineTo(xMid, yEnd);
      this.intersectionChecker.addLine(wireId, this.makeLine(xMid,
        yStart, xMid,
        yEnd));
      this.checkIntersection(path, xMid, yEnd, componentTo.x - this.canvas.xOffset, yEnd)
      path.lineTo(componentTo.x - this.canvas.xOffset, yEnd);
      this.canvas.wirePath.addPath(path);
      return path;
    },
    /**
     * Function that makes a line object out of 4 points to be used in the intersectionchecker
     * @returns line object
     */
    makeLine(a, b, c, d) {
      return { xFrom: a, yFrom: b, xTo: c, yTo: d };
    },
    /**
     * Function that handles intersections for a horizontal line that goes from left to right
     * @param {*} path path of the line
     * @param {*} a start x coordinate of the line
     * @param {*} b start y coordinate of the line
     * @param {*} c end x coordinate of the line
     * @param {*} d end y coordinate of the line
     */
    checkIntersection(path, a, b, c, d) {
      var intersect = this.intersectionChecker.checkLine(this.makeLine(a, b, c, d));
      if (intersect) {
        for (var i of intersect){
          path.lineTo(i - 10, b);
          path.moveTo(i + 10, b);
        }
      }
    },
    /**
     * Function that handles intersections for a horizontal line that goes from right to left
     * @param {*} path path of the line
     * @param {*} a start x coordinate of the line
     * @param {*} b start y coordinate of the line
     * @param {*} c end x coordinate of the line
     * @param {*} d end y coordinate of the line
     */
    checkIntersectionRev(path, a, b, c, d) {
      var intersect = this.intersectionChecker.checkLine(this.makeLine(a, b, c, d));
      if (intersect) {
        for (var i of intersect){
          path.lineTo(i + 10, b);
          path.moveTo(i - 10, b);
        }
      }
    },
    /**
     * Function that makes a path when a component is wired to itself
     * @param entryFrom: the entry of the component where the path starts
     * @param entryTo: the entry of the component where the path ends
     * @param wireId: the id of the wire to make a path for
     * @returns 
     */
    makeSelfPath(entryFrom, entryTo, wireId) {
      var path = new Path2D();
      let component = this.components.get(entryFrom);
      var fromX = component.x - this.canvas.xOffset;
      var fromY = component.y - this.canvas.yOffset;

      let yEnd = this.calcYEnd(component, wireId);
      let yStart = this.calcYStart(component, wireId);
      var firstGate = component.inWireIds[0] == wireId;
      path.moveTo(
        //start
        fromX + this.canvas.gridInterval,
        yStart
      );
      if (firstGate) {
        //make path for the top gate
        //1
        path.lineTo(
          fromX + (5 * this.canvas.gridInterval) / 4,
          yStart
        );
        //2
        this.intersectionChecker.addLine(wireId, this.makeLine(fromX + (5 * this.canvas.gridInterval) / 4,
          yStart, fromX + (5 * this.canvas.gridInterval) / 4, fromY))
        path.lineTo(fromX + (5 * this.canvas.gridInterval) / 4, fromY);
        //3
        this.checkIntersectionRev(path, fromX + (5 * this.canvas.gridInterval) / 4, fromY, fromX - this.canvas.gridInterval / 4, fromY)
        path.lineTo(fromX - this.canvas.gridInterval / 4, fromY);
        //4
        this.intersectionChecker.addLine(wireId, this.makeLine(fromX - this.canvas.gridInterval / 4, fromY, fromX - this.canvas.gridInterval / 4, yEnd))
        path.lineTo(fromX - this.canvas.gridInterval / 4, yEnd);
        //5
        path.lineTo(fromX, yEnd);
      } else {
        //make path for the bottom gate
        //1
        path.lineTo(
          fromX + (5 * this.canvas.gridInterval) / 4,
          fromY + this.canvas.gridInterval / 2
        );
        //2
        this.intersectionChecker.addLine(wireId, this.makeLine(fromX + (5 * this.canvas.gridInterval) / 4,
          fromY + this.canvas.gridInterval / 2, fromX + (5 * this.canvas.gridInterval) / 4,
          fromY + this.canvas.gridInterval))
        path.lineTo(
          fromX + (5 * this.canvas.gridInterval) / 4,
          fromY + this.canvas.gridInterval
        );
        //3
        this.checkIntersectionRev(path, fromX + (5 * this.canvas.gridInterval) / 4,
          fromY + this.canvas.gridInterval, fromX - this.canvas.gridInterval / 4,
          fromY + this.canvas.gridInterval)
        path.lineTo(
          fromX - this.canvas.gridInterval / 4,
          fromY + this.canvas.gridInterval
        );
        //4
        this.intersectionChecker.addLine(wireId, this.makeLine(fromX - this.canvas.gridInterval / 4,
          fromY + this.canvas.gridInterval, fromX - this.canvas.gridInterval / 4, yEnd))
        path.lineTo(fromX - this.canvas.gridInterval / 4, yEnd);
        //5
        path.lineTo(fromX, yEnd);
      }

      this.canvas.wirePath.addPath(path);
      return path;
    },
    /**
     * 
     * Function that makes a path when it has to go from right to left
     * @param entryFrom: the entry of the component where the path starts
     * @param entryTo: the entry of the component where the path ends
     * @param wireId: the id of the wire to make a path for
     * @returns 
     */
    makeRevPath(entryFrom, entryTo, wireId) {
      var path = new Path2D();
      let componentFrom = this.components.get(entryFrom);
      let componentTo = this.components.get(entryTo);
      var fromX = componentFrom.x - this.canvas.xOffset;
      var fromY = componentFrom.y - this.canvas.yOffset;
      var toX = componentTo.x - this.canvas.xOffset;
      var toY = componentTo.y - this.canvas.yOffset;

      let xMid =
        componentTo.x -
        this.canvas.xOffset +
        (componentFrom.x +
          this.canvas.gridInterval -
          this.canvas.xOffset -
          (componentTo.x - this.canvas.xOffset)) /
        2;
      let yEnd = this.calcYEnd(componentTo, wireId);
      let yStart = this.calcYStart(componentFrom, wireId);
      //collisions for autorouting
      if (
        ((componentFrom.x - componentTo.x) / this.canvas.gridInterval) % 2 ==
        0
      ) {
        if (componentFrom.y < componentTo.y) {
          xMid +=
            this.checkCollision(
              xMid,
              componentFrom.y +
              this.canvas.gridInterval / 2 -
              this.canvas.yOffset,
              yEnd,
              componentFrom.x,
              componentTo.x
            ) * this.canvas.gridInterval;
        } else if (componentFrom.y > componentTo.y) {
          xMid +=
            this.checkCollision(
              xMid,
              yEnd,
              componentFrom.y +
              this.canvas.gridInterval / 2 -
              this.canvas.yOffset,
              componentFrom.x,
              componentTo.x
            ) * this.canvas.gridInterval;
        }
      }
      path.moveTo(
        //start
        fromX + this.canvas.gridInterval,
        yStart
      );
      //1
      path.lineTo(
        fromX + (5 * this.canvas.gridInterval) / 4,
        yStart
      );
      if (componentFrom.y > componentTo.y) {
        //make path from the top
        //2
        path.lineTo(fromX + (5 * this.canvas.gridInterval) / 4, fromY);
        //3
        this.checkIntersectionRev(path, fromX + (5 * this.canvas.gridInterval) / 4, fromY, xMid, fromY);
        path.lineTo(xMid, fromY);
        //4
        this.intersectionChecker.addLine(wireId, this.makeLine(xMid, fromY, xMid, toY + this.canvas.gridInterval));
        path.lineTo(xMid, toY + this.canvas.gridInterval);
        //5
        this.checkIntersectionRev(path, xMid, toY + this.canvas.gridInterval, toX - this.canvas.gridInterval / 4,
          toY + this.canvas.gridInterval);
        path.lineTo(
          toX - this.canvas.gridInterval / 4,
          toY + this.canvas.gridInterval
        );
        //6
        this.intersectionChecker.addLine(wireId, this.makeLine(toX - this.canvas.gridInterval / 4, toY + this.canvas.gridInterval, toX - this.canvas.gridInterval / 4, yEnd));
        path.lineTo(toX - this.canvas.gridInterval / 4, yEnd);
        //7
        path.lineTo(toX, yEnd);
      } else {
        //make path from the bottom
        //2
        path.lineTo(fromX + (5 * this.canvas.gridInterval) / 4, fromY);
        //3
        this.checkIntersectionRev(path, fromX + (5 * this.canvas.gridInterval) / 4, fromY, xMid, fromY)
        path.lineTo(xMid, fromY);
        //4
        this.intersectionChecker.addLine(wireId, this.makeLine(xMid, fromY, xMid, toY - this.canvas.gridInterval));
        path.lineTo(xMid, toY - this.canvas.gridInterval);
        //5
        this.checkIntersectionRev(path, xMid, toY - this.canvas.gridInterval, toX - this.canvas.gridInterval / 4,
          toY - this.canvas.gridInterval);
        path.lineTo(
          toX - this.canvas.gridInterval / 4,
          toY - this.canvas.gridInterval
        );
        //6
        this.intersectionChecker.addLine(wireId, this.makeLine(toX - this.canvas.gridInterval / 4,toY - this.canvas.gridInterval,toX - this.canvas.gridInterval / 4, yEnd));
        path.lineTo(toX - this.canvas.gridInterval / 4, yEnd);
        //7
        path.lineTo(toX, yEnd);
      }
      this.canvas.wirePath.addPath(path);
      return path;
    },
    /**
     * Function that makes a Path2D object for the preview of a wire with inflection points
     * @param wireId: the id of the wire to make a path for
     */
    makeCustomPrevPath(wire) {
      var path = new Path2D();
      let componentFrom = this.components.get(wire.entryFrom);
      let yStart = this.calcYStart(componentFrom, wire.wireId);
      path.moveTo(
        //start
        componentFrom.x + this.canvas.gridInterval - this.canvas.xOffset,
        yStart
      );
      let prevPoint = {
        x: componentFrom.x + this.canvas.gridInterval,
        y: yStart + this.canvas.yOffset,
      };
      for (let i of wire.inflPoints) {
        path.lineTo(
          i.x - this.canvas.xOffset,
          prevPoint.y - this.canvas.yOffset
        );
        path.lineTo(i.x - this.canvas.xOffset, i.y - this.canvas.yOffset);
        prevPoint = i;
      }
      this.canvas.wirePath.addPath(path);
      return path;
    },
    /**
     * Function that makes a Path2D object for a wire with inflection points
     * @param entryFrom: the entry of the component where the path starts
     * @param entryTo: the entry of the component where the path ends
     * @param wireId: the id of the wire to make a path for
     */
    makeCustomPath(entryFrom, entryTo, wireId) {
      var path = new Path2D();
      let componentFrom = this.components.get(entryFrom);
      let componentTo = this.components.get(entryTo);
      let yEnd = 0;
      let yStart = this.calcYStart(componentFrom, wireId);
      if (
        componentTo.type == "not-gate" ||
        componentTo.type == "logic-analyser" ||
        componentTo.type == "LED"
      ) {
        yEnd =
          componentTo.y + this.canvas.gridInterval / 2 - this.canvas.yOffset;
      } else if (componentTo.inWireIds[0] == wireId) {
        yEnd =
          componentTo.y + this.canvas.gridInterval / 3 - this.canvas.yOffset;
      } else {
        yEnd =
          componentTo.y +
          (this.canvas.gridInterval - this.canvas.gridInterval / 3) -
          this.canvas.yOffset;
      }
      path.moveTo(
        //start
        componentFrom.x + this.canvas.gridInterval - this.canvas.xOffset,
        yStart
      );
      let prevPoint = {
        x: componentFrom.x + this.canvas.gridInterval,
        y: yStart + this.canvas.yOffset,
      };
      for (let i of this.wires.get(wireId).inflPoints) {
        if(prevPoint.x - this.canvas.xOffset < i.x - this.canvas.xOffset){
          this.checkIntersection(path, prevPoint.x - this.canvas.xOffset, prevPoint.y - this.canvas.yOffset, i.x - this.canvas.xOffset, prevPoint.y - this.canvas.yOffset);
        }
        else{
          this.checkIntersectionRev(path, prevPoint.x - this.canvas.xOffset, prevPoint.y - this.canvas.yOffset, i.x - this.canvas.xOffset, prevPoint.y - this.canvas.yOffset);
        }
        path.lineTo(
          i.x - this.canvas.xOffset,
          prevPoint.y - this.canvas.yOffset
        );
        this.intersectionChecker.addLine(wireId, this.makeLine(i.x - this.canvas.xOffset, prevPoint.y - this.canvas.yOffset, i.x - this.canvas.xOffset, i.y - this.canvas.yOffset));
        path.lineTo(i.x - this.canvas.xOffset, i.y - this.canvas.yOffset);
        prevPoint = i;
      }
      if(prevPoint.x - this.canvas.xOffset < componentTo.x - this.canvas.xOffset - 10){
        this.checkIntersection(path, prevPoint.x - this.canvas.xOffset, prevPoint.y - this.canvas.yOffset, componentTo.x - this.canvas.xOffset - 10,prevPoint.y - this.canvas.yOffset);
      }
      else{
        this.checkIntersectionRev(path, prevPoint.x - this.canvas.xOffset, prevPoint.y - this.canvas.yOffset, componentTo.x - this.canvas.xOffset - 10,prevPoint.y - this.canvas.yOffset);
      }
      
        
      path.lineTo(
        componentTo.x - this.canvas.xOffset - 10,
        prevPoint.y - this.canvas.yOffset
      );
      this.intersectionChecker.addLine(wireId, this.makeLine(componentTo.x - this.canvas.xOffset - 10, prevPoint.y - this.canvas.yOffset, componentTo.x - this.canvas.xOffset - 10, yEnd));
      path.lineTo(componentTo.x - this.canvas.xOffset - 10, yEnd);
      path.lineTo(componentTo.x - this.canvas.xOffset, yEnd);
      this.canvas.wirePath.addPath(path);
      return path;
    },
    /**
     * Function that makes a temporary path for the wire that is being created
     * @param {} mousePos: mousePos of the clicked point (new inflection point)
     * @returns PATH2D object with the temporary path
     */
    makeTempPath(mousePos) {
      var path = new Path2D();

      let componentFrom = this.components.get(
        this.wires.get(this.highestWireId).entryFrom
      );
      let yStart = this.calcYStart(componentFrom, this.highestWireId);
      path.moveTo(
        componentFrom.x + this.canvas.gridInterval - this.canvas.xOffset,
        yStart
      );
      path.lineTo(mousePos.x, mousePos.y);
      return path;
    },
  },
}