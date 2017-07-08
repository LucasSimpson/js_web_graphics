/**
 * Created by lucas on 08/07/17.
 */

class PolygonData {
    protected vertices: Array<number> = [];
    protected colors: Array<number> = [];
    protected indices: Array<number> = [];

    public getColors() {
        return this.colors;
    }

    public getVertices() {
        return this.vertices;
    }

    public getIndices() {
        return this.indices;
    }

    public mergeWith(other: PolygonData) {
        this.vertices = this.vertices.concat(other.vertices);
        this.colors = this.colors.concat(other.colors);
        this.indices = this.indices.concat(other.indices);
    }
}

class SceneManager extends PolygonData {

}

class Cube extends PolygonData {
    // private vertices: Array<number> = [];
    // private colors: Array<number> = [];
    // private indices: Array<number> = [];

    constructor(x, y, z, sx, sy, sz: number) {
        super();

        this.vertices = [
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
        let colors: Array<Array<number>> = [
            [1.0, 1.0, 1.0, 1.0],    // Front face: white
            [1.0, 0.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0]     // Left face: purple
        ];

        // Convert the array of colors into a table for all the vertices.
        this.colors = [];
        for (let j = 0; j < 6; j++) {
            let c = colors[j];

            // Repeat each color four times for the four vertices of the face
            for (let i = 0; i < 4; i++) {
                this.colors = this.colors.concat(c);
            }
        }

        // link vertices together into triangles. Polygon color
        // specified by color in similar index
        this.indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23    // left
        ];

    }
}

let cube:Cube = new Cube(1, 1, 1, 1, 1, 1);

polys = {
    vertices: cube.getVertices(),
    colors: cube.getColors(),
    indices: cube.getIndices()
};