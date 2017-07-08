/**
 * Created by lucas on 08/07/17.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PolygonData = (function () {
    function PolygonData() {
        this.vertices = [];
        this.colors = [];
        this.indices = [];
    }
    PolygonData.prototype.getColors = function () {
        return this.colors;
    };
    PolygonData.prototype.getVertices = function () {
        return this.vertices;
    };
    PolygonData.prototype.getIndices = function () {
        return this.indices;
    };
    PolygonData.prototype.mergeWith = function (other) {
        this.vertices = this.vertices.concat(other.vertices);
        this.colors = this.colors.concat(other.colors);
        this.indices = this.indices.concat(other.indices);
    };
    return PolygonData;
}());
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    function SceneManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SceneManager;
}(PolygonData));
var Cube = (function (_super) {
    __extends(Cube, _super);
    // private vertices: Array<number> = [];
    // private colors: Array<number> = [];
    // private indices: Array<number> = [];
    function Cube(x, y, z, sx, sy, sz) {
        var _this = _super.call(this) || this;
        _this.vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,
            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,
            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ];
        // build colors
        var colors = [
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 0.0, 0.0, 1.0],
            [0.0, 1.0, 0.0, 1.0],
            [0.0, 0.0, 1.0, 1.0],
            [1.0, 1.0, 0.0, 1.0],
            [1.0, 0.0, 1.0, 1.0] // Left face: purple
        ];
        // Convert the array of colors into a table for all the vertices.
        _this.colors = [];
        for (var j = 0; j < 6; j++) {
            var c = colors[j];
            // Repeat each color four times for the four vertices of the face
            for (var i = 0; i < 4; i++) {
                _this.colors = _this.colors.concat(c);
            }
        }
        // link vertices together into triangles. Polygon color
        // specified by color in similar index
        _this.indices = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23 // left
        ];
        return _this;
    }
    return Cube;
}(PolygonData));
var cube = new Cube(1, 1, 1, 1, 1, 1);
polys = {
    vertices: cube.getVertices(),
    colors: cube.getColors(),
    indices: cube.getIndices()
};
//# sourceMappingURL=framework.js.map