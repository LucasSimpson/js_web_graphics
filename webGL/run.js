// Globals
var canvas;
var gl;
var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesIndexBuffer;
var cubeRotation = 0.0;
var cubeXOffset = 0.0;
var cubeYOffset = 0.0;
var cubeZOffset = 0.0;
var lastCubeUpdateTime = 0;
var xIncValue = 0.2;
var yIncValue = -0.4;
var zIncValue = 0.3;
var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var vertexColorAttribute;
var perspectiveMatrix;
var extensions;
// Get WebGL context, if standard is not available; fall back on alternatives        
function GetWebGLContext(canvas) {
    // Standard
    return canvas.getContext("webgl") ||
        // Alternative; Safari, others
        canvas.getContext("experimental-webgl") ||
        // Firefox; mozilla
        canvas.getContext("moz-webgl") ||
        // Last resort; Safari, and maybe others
        canvas.getContext("webkit-3d");
    // Note that "webgl" is not available as of Safari version <= 7.0.3
    // So we have to fall back to ambiguous alternatives for it and some other browsers
}
//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL(canvas) {
    // WebGL rendering context
    gl = null;
    // Array that will store a list of supported extensions
    extensions = null;
    // ! used twice in a row to cast object state to a Boolean value
    if (!!(window.WebGLRenderingContext) == true) {
        // Initialize WebGL rendering context, if available
        if (gl = GetWebGLContext(canvas)) {
            console.log("WebGL is initialized.");
            // Ensure OpenGL viewport is resized to match canvas dimensions
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            // Output the WebGL rendering context object to console for reference
            console.log(gl);
            // List available extensions
            extensions = gl.getSupportedExtensions();
            console.log(extensions);
        }
        else {
            console.log("Your browser doesn't support WebGL.");
        }
    }
    else {
        console.log("WebGL is supported, but disabled :-(");
    }
}
//
// start
//
// Called when the canvas is created to get the ball rolling.
//
function start() {
    canvas = document.getElementById("glcanvas");
    initWebGL(canvas); // Initialize the GL context
    // Only continue if WebGL is available and working
    if (gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Initialize the shaders; this is where all the lighting for the
        // vertices and so forth is established.
        initShaders();
        // Here's where we call the routine that builds all the objects
        // we'll be drawing.
        initBuffers();
        // Set up to draw the scene periodically.
        setInterval(drawScene, 15);
    }
}
//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// one object -- a simple two-dimensional cube.
//
function initBuffers() {
    // var cube = Cube();
    //
    console.log("cube is:::");
    console.log(polys);

    // var polys = {
    //     vertices: cube.getVertices(),
    //     colors: cube.getColors(),
    //     indices: cube.getIndices()
    // };

    // var polys = build_polygons();

    // Create a buffer for the cube's vertices.
    cubeVerticesBuffer = gl.createBuffer();
    // Select the cubeVerticesBuffer as the one to apply vertex
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    // Now pass the list of vertices into WebGL to build the shape. We
    // do this by creating a Float32Array from the JavaScript array,
    // then use it to fill the current vertex buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polys.vertices), gl.STATIC_DRAW);
    // create buffer for the colors
    cubeVerticesColorBuffer = gl.createBuffer();
    // bind buffer to array?
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
    // pass the list
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(polys.colors), gl.STATIC_DRAW);
    // Build the element array buffer; this specifies the indices
    // into the vertex array for each face's vertices.
    cubeVerticesIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    // Now send the element array to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(polys.indices), gl.STATIC_DRAW);
}
//
// drawScene
//
// Draw the scene.
//
function drawScene() {
    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio of 640:480, and we only want to see objects between 0.1 units
    // and 100 units away from the camera.
    perspectiveMatrix = makePerspective(45, 640.0 / 480.0, 0.1, 100.0);
    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    loadIdentity();
    // Now move the drawing position a bit to where we want to start
    // drawing the cube.
    mvTranslate([-0.0, 0.0, -6.0]);
    // Save the current matrix, then rotate before we draw.
    mvPushMatrix();
    mvRotate(cubeRotation, [1, 0, 1]);
    mvTranslate([cubeXOffset, cubeYOffset, cubeZOffset]);
    // Draw the cube by binding the array buffer to the cube's vertices
    // array, setting attributes, and pushing it to GL.
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    // Set the colors attribute for the vertices.
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
    // Draw the cube.
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    // Restore the original matrix
    mvPopMatrix();
    // Update the rotation for the next draw, if it's time to do so.
    var currentTime = (new Date).getTime();
    if (lastCubeUpdateTime) {
        var delta = currentTime - lastCubeUpdateTime;
        cubeRotation += (30 * delta) / 1000.0;
        cubeXOffset += xIncValue * ((30 * delta) / 1000.0);
        cubeYOffset += yIncValue * ((30 * delta) / 1000.0);
        cubeZOffset += zIncValue * ((30 * delta) / 1000.0);
        if (Math.abs(cubeYOffset) > 2.5) {
            xIncValue = -xIncValue;
            yIncValue = -yIncValue;
            zIncValue = -zIncValue;
        }
    }
    lastCubeUpdateTime = currentTime;
}
//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    // Create the shader program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var shader = void 0;
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
    }
    gl.useProgram(shaderProgram);
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
}
//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    // Didn't find an element with the specified ID; abort.
    if (!shaderScript) {
        return null;
    }
    // Walk through the source element's children, building the
    // shader source string.
    var theSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
        if (currentChild.nodeType == 3) {
            theSource += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }
    // Now figure out what type of shader script we have,
    // based on its MIME type.
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else {
        return null; // Unknown shader type
    }
    // Send the source to the shader object
    gl.shaderSource(shader, theSource);
    // Compile the shader program
    gl.compileShader(shader);
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
//
// Matrix utility functions
//
function loadIdentity() {
    mvMatrix = Matrix.I(4);
}
function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}
function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}
function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}
var mvMatrixStack = [];
function mvPushMatrix(m) {
    if (m) {
        mvMatrixStack.push(m.dup());
        mvMatrix = m.dup();
    }
    else {
        mvMatrixStack.push(mvMatrix.dup());
    }
}
function mvPopMatrix() {
    if (!mvMatrixStack.length) {
        throw ("Can't pop from an empty matrix stack.");
    }
    mvMatrix = mvMatrixStack.pop();
    return mvMatrix;
}
function mvRotate(angle, v) {
    var inRadians = angle * Math.PI / 180.0;
    var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
    multMatrix(m);
}
/**************************************************************************/
/**************************************************************************/
function build_cube() {
    var vertices = [
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
    var colors = [
        [1.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [1.0, 0.0, 1.0, 1.0] // Left face: purple
    ];
    // Convert the array of colors into a table for all the vertices.
    var generatedColors = [];
    for (var j = 0; j < 6; j++) {
        var c = colors[j];
        // Repeat each color four times for the four vertices of the face
        for (var i = 0; i < 4; i++) {
            generatedColors = generatedColors.concat(c);
        }
    }
    // link vertices together into triangles. Polygon color
    // specified by color in similar index
    var cubeVertexIndices = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        8, 9, 10, 8, 10, 11,
        12, 13, 14, 12, 14, 15,
        16, 17, 18, 16, 18, 19,
        20, 21, 22, 20, 22, 23 // left
    ];
    return {
        vertices: vertices,
        colors: generatedColors,
        indices: cubeVertexIndices
    };
}
function append(polys, new_polys) {
    polys.vertices = polys.vertices.concat(new_polys.vertices);
    polys.colors = polys.colors.concat(new_polys.colors);
    polys.indices = polys.indices.concat(new_polys.indices);
    return polys;
}
function build_polygons() {
    var polys = {
        vertices: [],
        colors: [],
        indices: []
    };
    polys = append(polys, build_cube());
    return polys;
}
//# sourceMappingURL=run.js.map