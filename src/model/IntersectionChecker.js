export default class IntersectionChecker {
    constructor() {
        this._linePoints = new Map();
        this.wireIntersections = new Map();
    }
    /**
     * Function that adds a (vertical) line represented by 4 points into the hashmap 
     * @param {} id wireId of the wire that the line is part of
     * @param {*} line 4 points representing the line
     */
    addLine(id, line) {
        if(this._linePoints.has(id)){
            if(this._linePoints.get(id).indexOf(line) === -1){
                this._linePoints.get(id).push(line);
            }
        }
        else{
            this._linePoints.set(id, [line]);
        }
    }
    /**
     * Function that checks if there are intersections for a given horizontal line
     * @param {*} line : line to check
     * @returns false if there are no intersections, otherwise it will return a sorted array of intersections
     */
    checkLine(line) {
        var intersections= [];
        var intersection;
        for (var j of this._linePoints.values()) {
            for(var i of j){
                if (this.intersects(i.xFrom, i.yFrom, i.xTo, i.yTo, line.xFrom, line.yFrom, line.xTo, line.yTo)) {
                    intersection = this.calculateIntersection(i.xFrom, i.yFrom, i.xTo, i.yTo, line.xFrom, line.yFrom, line.xTo, line.yTo);
                    if(intersections.indexOf(intersection) === -1){
                        intersections.push(intersection);
                    }
                }
            }
            
        }
        if(intersections.length == 0){
            return false;
        }
        return intersections.sort();
    }
    /**
     * Removes all lines from the hasmap of a given wire
     * @param {*} wireId : id of the wire
     */
    removeWire(wireId){
        this._linePoints.delete(wireId);
    }
    // Code van https://dirask.com/posts/JavaScript-calculate-intersection-point-of-two-lines-for-given-4-points-VjvnAj
    /**
     * Function that calculates the intersection point between the lines made by (a,b,c,d) and (p,q,r,s)
     * @returns x value of the intersection point
     */
    calculateIntersection(a, b, c, d, p, q, r, s) {
        var p1 = { x: a, y: b };
        var p2 = { x: c, y: d };
        var p3 = { x: p, y: q };
        var p4 = { x: r, y: s };
        var c2x = p3.x - p4.x; // (x3 - x4)
        var c3x = p1.x - p2.x; // (x1 - x2)
        var c2y = p3.y - p4.y; // (y3 - y4)
        var c3y = p1.y - p2.y; // (y1 - y2)

        // down part of intersection point formula
        var down = c3x * c2y - c3y * c2x;

        if (down == 0) {
            throw new Error('Number of intersection points is zero or infinity.');
        }

        // upper part of intersection point formula
        var u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
        var u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)

        // intersection point formula

        var px = (u1 * c2x - c3x * u4) / down;
        return px;
    }
    // returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
    //Code van https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    intersects(a, b, c, d, p, q, r, s) {
        var det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b);
        if (det === 0) {
            return false;
        } else {
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }
    get linePoints() {
        return this._linePoints;
    }
}