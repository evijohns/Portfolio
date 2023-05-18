var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 20.0;
    gl_PointSize = u_Size;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

  //Constants
  const POINT = 0;
  const TRIANGLE = 1;
  const CIRCLE = 2;
  //Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

//Probably don't have to touch this function ever again
function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    //gl = getWebGLContext(canvas);
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    //Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, "u_Size");
    if(!u_Size) {
      console.log('Failed to get the storage location of u_Size');
      return;
    }
}

function clearcanvas(){
    g_shapesList = [];
    renderAllShapes();
    canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

//Globals related to UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
let segment = 10;
//Set up actions for the HTML UI elements
function addActionsForHtmlUI() {

    // Button Events (Shape Type)
    document.getElementById('red').onclick    = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; }
    document.getElementById('green').onclick  = function() { g_selectedColor = [0.0,1.0,0.0,1.0]; }
    document.getElementById('blue').onclick = function() { g_selectedColor = [0.0, 0.0, 1.0, 1.0]; }

    document.getElementById('clearButton').onclick    = function() { g_shapesList=[]; renderAllShapes();};
    document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
    document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};


    // Color Slider Events
    document.getElementById('redSlide').addEventListener('mouseup',   function()  { g_selectedColor[0] = this.value/100; });
    document.getElementById('greenSlide').addEventListener('mouseup', function()  { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup',  function()  { g_selectedColor[2] = this.value/100; });

    // Size Slider Events
    document.getElementById("sizeSlide").addEventListener('mouseup', function() {g_selectedSize = this.value; });
    document.getElementById('segmentSlide').addEventListener('mouseup', function () {segment = this.value });



  }

function main() {
  //set up canvas and gl variables
  setupWebGL();
  //set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();
  //clearcanvas();
  //set up actions for html ui elements
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev)} };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


var g_shapesList = [];

function click(ev) {

    //extract the event click and return it in WebGL coordinates
    let [x, y] = convertCoordinatesEventToGL(ev);

    // Create and store the new pointer
    let shape;
    if(g_selectedType==POINT) {
      shape = new Point();
    } else if (g_selectedType==TRIANGLE){
      shape = new Triangle();
    } else {
      shape = new Circle();
      shape.segments = segment;
    }
    shape.position=[x,y];
    shape.color=g_selectedColor.slice()
    shape.size=g_selectedSize;
    g_shapesList.push(shape);

    //Draw every shape that is supposed to be in the canvas
    renderAllShapes();
}

//extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width  ) / (canvas.width  );
    y = (canvas.height   - (y - rect.top)) / (canvas.height  );

    return ([x, y]);
}

//Draw every shape that is supposed to be in the canvas
function renderAllShapes() {

  //check the time at the start of this function
  var startTime = performance.now();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw each shape in the List
    var len = g_shapesList.length;

    for(var i = 0; i < len; i++) {
      g_shapesList[i].render();
    }

    //check the time at the end of the function, and show on webpage
    var duration = performance.now() - startTime;
    sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(10000 / duration)/10, 'numdot');
}


//Set up a button to recreate the drawing using WebGL triangles
function recreateDrawing() {
  clearcanvas();

// use ATLEAST 20 TRIANGLES
// new Triangle object for each triangle that makes up the ICE King
//head
var T1 = new Triangle();
T1.size = 50;
T1.type = 'triangle';
T1.position = [-0.2, 0.2, 0.0];
T1.color = [0.678, 0.847, 0.902, 1.0];
g_shapesList[0] = T1;

var T2 = new Triangle();
T2.size = 50;
T2.type = 'triangle';
T2.position = [-0.1, 0.3, 0.0];
T2.color = [0.678, 0.847, 0.902, 1.0];
g_shapesList[1] = T2;

var T3 = new Triangle();
T3.size = 50;
T3.type = 'triangle';
T3.position = [0.0, 0.3, 0.0];
T3.color = [0.678, 0.847, 0.902, 1.0];
g_shapesList[2] = T3;

var T4 = new Triangle();
T4.size = 50;
T4.type = 'triangle';
T4.position = [0.1, 0.3, 0.0];
T4.color = [0.678, 0.847, 0.902, 1.0];
g_shapesList[3] = T4;

var T5 = new Triangle();
T5.size = 50;
T5.type = 'triangle';
T5.position = [0.2, 0.2, 0.0];
T5.color = [0.678, 0.847, 0.902, 1.0];
g_shapesList[4] = T5;

var T6 = new Triangle();
T6.size = 50;
T6.type = 'triangle';
T6.position = [0.0, -0.2, 0.0];
T6.color = [1.0, 1.0, 1.0, 1.0];
g_shapesList[5] = T6;

var T7 = new Triangle();
T7.size = 50;
T7.type = 'triangle';
T7.position = [-0.1, -0.2, 0.0];
T7.color = [1.0, 1.0, 1.0, 1.0];
g_shapesList[6] = T7;

var T8 = new Triangle();
T8.size = 50;
T8.type = 'triangle';
T8.position = [0.1, -0.2, 0.0];
T8.color = [1.0, 1.0, 1.0, 1.0];
g_shapesList[7] = T8;


//body
var T9  = new Triangle();
T9.size = 50;
T9.type = 'triangle';
T9.position = [-0.2, -0.2, 0.0];
T9.color = [0.0, 0.4, 0.8, 1.0];
g_shapesList[8] = T9;

var T10 = new Triangle();
T10.size = 50;
T10.type = 'triangle';
T10.position = [-0.1, -0.3, 0.0];
T10.color = [0.0, 0.4, 0.8, 1.0];
g_shapesList[9] = T10;

var T11 = new Triangle();
T11.size = 50;
T11.type = 'triangle';
T11.position = [0.0, -0.3, 0.0];
T11.color = [0.0, 0.4, 0.8, 1.0];
g_shapesList[10] = T11;

var T12 = new Triangle();
T12.size = 50;
T12.type = 'triangle';
T12.position = [0.1, -0.3, 0.0];
T12.color = [0.0, 0.4, 0.8, 1.0];
g_shapesList[11] = T12;


var T13 = new Triangle();
T13.size = 50;
T13.type = 'triangle';
T13.position = [0.2, -0.2, 0.0];
T13.color = [0.0, 0.4, 0.8, 1.0];
g_shapesList[12] = T13;


//crown
var T14 = new Triangle();
T14.size = 20;
T14.type = 'triangle';
T14.position = [-0.1, 0.45, 0.0];
T14.color = [1.0, 1.0, 0.0, 1.0];
g_shapesList[13] = T14;

var T15 = new Triangle();
T15.size = 20;
T15.type = 'triangle';
T15.position = [0.1, 0.45, 0.0];
T15.color = [1.0, 1.0, 0.0, 1.0];
g_shapesList[14] = T15;

var T16 = new Triangle();
T16.size = 20;
T16.type = 'triangle';
T16.position = [0, 0.45, 0.0];
T16.color = [1.0, 1.0, 0.0, 1.0];
g_shapesList[15] = T16;

var T17 = new Triangle(); // add a red triangle inside T14
T17.size = 5;
T17.type = 'triangle';
T17.position = [-0.1, 0.38, 0.0];
T17.color = [1.0, 0.0, 0.0, 1.0];
g_shapesList[16] = T17;

var T18 = new Triangle(); // add a red triangle inside T15
T18.size = 5;
T18.type = 'triangle';
T18.position = [0.1, 0.38, 0.0];
T18.color = [1.0, 0.0, 0.0, 1.0];
g_shapesList[17] = T18;

var T19 = new Triangle(); // add a red triangle inside T16
T19.size = 5;
T19.type = 'triangle';
T19.position = [0.0, 0.38, 0.0];
T19.color = [1.0, 0.0, 0.0, 1.0];
g_shapesList[18] = T19;



// create the eyes and nose triangle

var T20 = new Triangle(); // add a white triangle for the left eye
T20.size = 10;
T20.type = 'triangle';
T20.position = [-0.1, 0.1, 0.0];
T20.color = [1.0, 1.0, 1.0, 1.0];
g_shapesList[19] = T20;

var T21 = new Triangle(); // add a white triangle for the right eye
T21.size = 10;
T21.type = 'triangle';
T21.position = [0.1, 0.1, 0.0];
T21.color = [1.0, 1.0, 1.0, 1.0];
g_shapesList[20] = T21;

var T22 = new Triangle(); // add a white triangle for the nose
T22.size = 10;
T22.type = 'triangle';
T22.position = [0.0, 0.0, 0.0];
T22.color = [1.0, 1.0, 1.0, 1.0];
g_shapesList[21] = T22;



renderAllShapes();
}



//Set the text of an HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log('Failed to get ' + htmlID + ' from HTML');
        return;
    }
    htmlElm.innerHTML = text;
}
