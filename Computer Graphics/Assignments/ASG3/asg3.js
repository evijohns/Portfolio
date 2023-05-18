// Vertex shader program
var VSHADER_SOURCE = `
 // Set the floating point precision
 precision mediump float;

 // Input vertex attributes
 attribute vec4 a_Position;
 attribute vec2 a_UV;

 // Pass to fragment shader
 varying vec2 v_UV;

 // Input matrix uniforms for transformations
 uniform mat4 u_ModelMatrix;  // Model matrix
 uniform mat4 u_GlobalRotateMatrix;  // Global rotation matrix
 uniform mat4 u_ViewMatrix;  // View matrix
 uniform mat4 u_ProjectionMatrix;  // Projection matrix

 void main() {
  // Multiply the position vector by the model, global rotation, view and projection matrices
  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;

  // Pass the UV coordinates to the fragment shader
  v_UV = a_UV;
 }`

// Fragment shader program
var FSHADER_SOURCE = `
 // Set the floating point precision
 precision mediump float;

 // Input from vertex shader
 varying vec2 v_UV;

 // Input uniforms for fragment shader
 uniform vec4 u_FragColor;  // Fragment color
 uniform sampler2D u_Sampler0;  // Texture sampler 0
 uniform sampler2D u_Sampler1;  // Texture sampler 1
 uniform sampler2D u_Sampler2;  // Texture sampler 2
 uniform sampler2D u_Sampler3;  // Texture sampler 3
 uniform int u_TextureType;  // Texture type

 void main() {
  // Choose the fragment color based on the texture type
  if (u_TextureType == -2)
   // Set the fragment color to the input color
   gl_FragColor = u_FragColor;
  else if (u_TextureType == 0)
   // Sample the color from texture sampler 0
   gl_FragColor = texture2D(u_Sampler0, v_UV);
  else if (u_TextureType == 1)
   // Sample the color from texture sampler 1
   gl_FragColor = texture2D(u_Sampler1, v_UV);
  else if (u_TextureType == 2)
   // Sample the color from texture sampler 2
   gl_FragColor = texture2D(u_Sampler2, v_UV);
  else if(u_TextureType == 3)
   // Sample the color from texture sampler 3
   gl_FragColor = texture2D(u_Sampler3, v_UV);
  else 
   // Default color if no valid texture type is provided
   gl_FragColor = vec4(1, 0.5, 0.5, 1);
 }`


// Global Vars
let webCanvas;
let gl;
let vertexBuffer;

let a_Position;
let a_UV;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_FragColor;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_TextureType;
let blockCreate = 0;

let FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT;



// Main ---------------------------------------------------------------------------------


function main() {
 // set up WebGL context, shaders, etc.
 setUpWebGL();
 connectVariablesToGLSL();
 addUI();
 initTextures();

 // Specify the color for clearing <webCanvas>
 gl.clearColor(0.0, 0.0, 0.0, 1.0);

 worldCreate(myWorld);

 webCanvas.onmousedown = clickEvents;
 document.onkeydown = keydown;
 

}

//WebGl and Textur functionalities ---------------------------------------------------------
function setUpWebGL(){        // Set up WebGL and create buffers
 // Retrieve <webCanvas> element
 webCanvas = document.getElementById('webgl');

 // Get the rendering context for WebGL
 gl = getWebGLContext(webCanvas, false, {preserveDrawingBuffer: true } );
 if (!gl) {
  console.log('Failed to get the rendering context for WebGL');
  return;
 }

 // Create a vertex buffer
 vertexBuffer = gl.createBuffer();
 if (!vertexBuffer) {
  console.log('Failed to create the vertex buffer object');
  return -1;
 }
 // Bind the buffer object to target
 gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

 // enable gl.DEPTH_TEST
 gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){  // Link variables from shaders to JavaScript
 // Initialize shaders
 if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  console.log('Failed to intialize shaders.');
  return;
 }

 // Get the storage location of a_Position
 a_Position = gl.getAttribLocation(gl.program, 'a_Position');
 if (a_Position < 0) {
  console.log('Failed to get the storage location of a_Position');
  return;
 }

 a_UV = gl.getAttribLocation(gl.program, 'a_UV');
 if (a_UV < 0) {
  console.log('Failed to get the storage location of a_UV');
  return;
 }

 // Get the storage location of u_FragColor
 u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
 if (!u_FragColor) {
  console.log('Failed to get the storage location of u_FragColor');
  return;
 }

 // Get the storage location of u_ModelMatrix
 u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
 if (!u_ModelMatrix) {
  console.log('Failed to get the storage location of u_ModelMatrix');
  return;
 }

 u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
 if (!u_GlobalRotateMatrix) {
  console.log('Failed to get the storage location of u_GlobalRotateMatrix');
  return;
 }

 u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
 if (!u_ViewMatrix) {
  console.log('Failed to get the storage location of u_ViewMatrix');
  return;
 }

 u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
 if (!u_ProjectionMatrix) {
  console.log('Failed to get the storage location of u_ProjectionMatrix');
  return;
 }

 u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
 if(!u_Sampler0) {
  console.log('Failed to get the storage location of u_Sampler0');
  return;
 }

 u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
 if(!u_Sampler1) {
  console.log('Failed to get the storage location of u_Sampler1');
  return;
 }

 u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
 if(!u_Sampler2) {
  console.log('Failed to get the storage location of u_Sampler2');
  return;
 }

 u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
 if(!u_Sampler3) {
  console.log('Failed to get the storage location of u_Sampler3');
  return;
 }

 u_TextureType = gl.getUniformLocation(gl.program, 'u_TextureType');
 if(!u_TextureType) {
  console.log('Failed to get the storage location of u_TextureType');
  return;
 }


}

function addUI() {          // Add UI Functionality from HTML Page
 
 document.getElementById('bt0').onclick = function() { blockCreate = 0; };
 document.getElementById('bt1').onclick = function() { blockCreate = 1; };
 document.getElementById('bt2').onclick = function() { blockCreate = 2; };
 document.getElementById('bt3').onclick = function() { blockCreate = 3; };
}


function initTextures(){       // Initialize textures to be used

// Image 0 ------------------------------------------------
 var image0 = new Image();
 if(!image0) {
  console.log('Failed to create the image');
  return false;
 }
 image0.onload = function(){ loadTexture(image0, 0); };
 image0.src = 'textures/HelloKitty.jpg'

 // Image 1 ------------------------------------------------
 var image1 = new Image();
 if(!image1) {
  console.log('Failed to create the image');
  return false;
 }
 image1.onload = function(){ loadTexture(image1, 1); };
 image1.src = 'textures/kuromi.jpg'

 // Image 2 ------------------------------------------------
 var image2 = new Image();
 if(!image2) {
  console.log('Failed to create the image');
  return false;
 }
 image2.onload = function(){ loadTexture(image2, 2); };
 image2.src = 'textures/Chococat.jpg';
 
// Image 3 ------------------------------------------------
var image3 = new Image();
if(!image3) {
 console.log('Failed to create the image');
 return false;
}
image3.onload = function(){ loadTexture(image3, 3); };
image3.src = 'textures/cinnamoroll.jpg';

 return true;
}


function loadTexture(image, texNum) {
  var texture = gl.createTexture();
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis
  gl.activeTexture(gl.TEXTURE0 + texNum);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // Set the texture uniform based on texNum
  switch (texNum) {
    case 0:
      gl.uniform1i(u_Sampler0, texNum);
      break;
    case 1:
      gl.uniform1i(u_Sampler1, texNum);
      break;
    case 2:
      gl.uniform1i(u_Sampler2, texNum);
      break;
    case 3:
      gl.uniform1i(u_Sampler3, texNum);
      break;
    default:
      break;
  }

  // Update the u_TextureType uniform
  gl.uniform1i(u_TextureType, texNum);

  RenderMyShapes();
}



// This function checks if a given point 'eye' is within the bounds of a virtual world and 
// not colliding with any blocks in that world.
function boundaries(eye) { 

  // Round the values of the eye's coordinates for simplicity.
  let roundedEye = eye.map(Math.round);

  // Destructure the rounded eye coordinates into separate variables for readability.
  let [eyeX, eyeY, eyeZ] = roundedEye;

  // Check if the eye is within the predefined boundaries of the world.
  // If the eye is outside these boundaries, or if it's below the surface of the world (eyeY < myWorld[eyeZ + 16][eyeX + 16]), return false.
  if (eyeX > 14 || eyeX < -15 || eyeY > 4 || eyeY < 0 || eyeZ > 14 || eyeZ < -15 || eyeY < myWorld[eyeZ + 16][eyeX + 16]) {
    return false;
  }

  // Iterate over the array of worldShapes starting from the index of the last generated block.
  for(let i = blockCreate; i < worldShapes.length; i++) {

    // Extract the x, y, z coordinates of the current block from its transformation matrix.
    let [temp_varX, temp_varY, temp_varZ] = new Vector3([
      worldShapes[i].matrix.elements[12], 
      worldShapes[i].matrix.elements[13], 
      worldShapes[i].matrix.elements[14] 
    ]).elements;

    // Check if the eye's position is the same as that of the current block.
    // If it is, it means the eye is colliding with a block, so return false.
    if (temp_varX === eyeX && temp_varY === eyeY && temp_varZ === eyeZ) {
      return false;
    }
  }

  // If the function hasn't returned false by this point, it means the eye is within bounds and not colliding with any blocks, so return true.
  return true;
}


var rotate = 1;

// Function to add a new block to the scene
function addBlock(blockPos, blockCreate) {
  if (boundaries(blockPos)) {
    const newBlock = new Cube();
    newBlock.textureType = blockCreate;
    newBlock.matrix.translate(blockPos[0], blockPos[1], blockPos[2]);
    worldShapes.push(newBlock);
  }
}

// Function to remove a block from the scene
function removeBlock(blockPos) {
  for (let i = generatedBlocks; i < worldShapes.length; i++) {
    const temp_var = new Vector3([
      worldShapes[i].matrix.elements[12],
      worldShapes[i].matrix.elements[13],
      worldShapes[i].matrix.elements[14]
    ]).elements;
    if (temp_var[0] === blockPos[0] && temp_var[1] === blockPos[1] && temp_var[2] === blockPos[2]) {
      worldShapes.splice(i, 1);
      break;
    }
  }
}

// clickEvents event handler
function clickEvents(ev) {
  let d_var = new Vector3(g_at.elements); // d_var eye lvl
  d_var.sub(g_eye);

  // Calculate the position of the new block or the block to be removed
  let blockPos = new Vector3(g_eye.elements).add(d_var.normalize());
  blockPos = new Vector3([
    Math.round(blockPos.elements[0]),
    Math.round(blockPos.elements[1]),
    Math.round(blockPos.elements[2])
  ]).elements;

  // Determine the action (add or remove block) based on the mouse button pressed
  if (ev.button === 0) { // Left button
    addBlock(blockPos, blockCreate);
  } else if (ev.button === 1 || ev.button === 2) { // Middle or right button
    removeBlock(blockPos);
  }

  // Render the updated scene
  RenderMyShapes();
}

// Define actions for each key
const keyActions = {
  87: moveForward,
  65: moveLeft,
  83: moveBackward,
  68: moveRight,
  81: rotateLeft,
  69: rotateRight,
  32: moveUp,
  17: moveDown,
};

function keydown(ev) { // Set up keybindings
  const action = keyActions[ev.keyCode];
  if (action) {
      action();
      RenderMyShapes();
  }
}

function moveForward() {
  let d_var = new Vector3(g_at.elements); // d_var eye lvl
  d_var.sub(g_eye);
  g_eye.add(d_var.normalize());
  g_at.add(d_var);

  if (!boundaries(g_eye.elements)) { // check if move was legal
      g_eye.sub(d_var);
      g_at.sub(d_var);
  }
}

function moveLeft() {
  let d_var = new Vector3(g_at.elements); // d_var eye lvl
  d_var.sub(g_eye);
  let c = Vector3.cross(d_var.normalize(), g_up);
  g_eye.sub(c);
  g_at.sub(c);

  if (!boundaries(g_eye.elements)) { // check if move was legal
      g_eye.add(c);
      g_at.add(c);
  }
}

// Continue from the previous block

function moveBackward() {
  let d_var = new Vector3(g_at.elements); // d_var eye lvl
  d_var.sub(g_eye);
  g_eye.sub(d_var.normalize());
  g_at.sub(d_var);

  if (!boundaries(g_eye.elements)) { // check if move was legal
      g_eye.add(d_var);
      g_at.add(d_var);
  }
}

function moveRight() {
  let d_var = new Vector3(g_at.elements); // d_var_var eye lvl
  d_var.sub(g_eye);
  let c = Vector3.cross(d_var.normalize(), g_up);
  g_eye.add(c);
  g_at.add(c);

  if (!boundaries(g_eye.elements)) { // check if move was legal
      g_eye.sub(c);
      g_at.add(c);
  }
}

function rotateLeft() {
  let d_var = new Vector3(g_at.elements); // d_var eye lvl
  d_var.sub(g_eye);
  let r = d_var.magnitude();
  let theta = Math.atan(d_var.elements[0]/d_var.elements[2]);
  if(Math.round(theta * 180/Math.PI) == -90){
      rotate *= -1;
  }
  theta += 5 / 180 * Math.PI;
  let newD = new Vector3([r * Math.sin(theta) * rotate, 0, r * Math.cos(theta) * rotate]);
  let theta2 = Math.atan(newD.elements[0]/newD.elements[2]);
  if(Math.round(theta * 180/Math.PI) != Math.round(theta2 * 180/Math.PI) && Math.round(theta2 * 180/Math.PI) != 90 && Math.round(theta2 * 180/Math.PI)!= -90){
      rotate *= -1;
  }
  g_at = new Vector3(g_eye.elements).sub(newD);
}

function rotateRight() {
  let d_var = new Vector3(g_at.elements); // d_var eye lvl
  d_var.sub(g_eye);
  let r = d_var.magnitude();
  let theta = Math.atan(d_var.elements[0]/d_var.elements[2]);
  if(Math.round(theta * 180/Math.PI) == 90){
      rotate *= -1;
  }
  theta -= 5 / 180 * Math.PI;
  let newD = new Vector3([r * Math.sin(theta) * rotate, 0, r * Math.cos(theta) * rotate]);
  let theta2 = Math.atan(newD.elements[0]/newD.elements[2]);
  if(Math.round(theta * 180/Math.PI) != Math.round(theta2 * 180/Math.PI) && Math.round(theta2 * 180/Math.PI) != 90 && Math.round(theta2 * 180/Math.PI)!= -90){
      rotate *= -1;
  }
  g_at = new Vector3(g_eye.elements).sub(newD);
}

function moveUp() {
  if(g_eye.elements[1] <= 3){
      g_eye.elements[1] += 1;
      g_at.elements[1] += 1;
  }
}

function moveDown() {
  if(g_eye.elements[1] >= 1){
      g_eye.elements[1] -=1;
      g_at.elements[1] -= 1;
  }
}


// Rendering and shape building -----------------------------------------------------------


// Global Camera Matrices
let globalRotMat = new Matrix4();
let viewMat = new Matrix4();
let projMat = new Matrix4();

// ViewMatrix vectors:
let g_eye = new Vector3([0, 0, 1]);
let g_at = new Vector3([0, 0, -100]);
let g_up = new Vector3([0, 1, 0]);

var myWorld = [
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
 [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
 [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
var worldShapes = []; // array to hold all blocks in the world including sky and ground
var generatedBlocks = 2;

var cielingShade = [0.5, 0.5, 1, 1]; // Light blue: RGB values (0.5, 0.5, 1)
var GROUNDCOLOR = [0.5, 1, 0.5, 1]; // Light green: RGB values (0.5, 1, 0.5)




function worldCreate(myWorld){ // create cubes to put into worldShapes given the array myWorld
 let cieling = new Cube();
 cieling.color = cielingShade;
 cieling.textureType = -2;
 cieling.matrix.translate(0, 2, 0);
 cieling.matrix.scale(32, 5, 32);
 worldShapes.push(cieling);

 let ground = new Cube();
 ground.color = GROUNDCOLOR;
 ground.textureType = -2;
 ground.matrix.translate(0, -0.5, 0);
 ground.matrix.scale(32, 0.01, 32);
 worldShapes.push(ground);

 for(let i = 0; i < myWorld.length; i++){
  for(let j = 0; j < myWorld[i].length; j++){
   for(let n = 0; n < myWorld[i][j]; n++){
    let temp_var = new Cube();
    temp_var.textureType = 0;
    temp_var.matrix.translate(j-16, n, i-16);
    worldShapes.push(temp_var);
    generatedBlocks++;
   }
  }  
 }
 
 gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
 projMat.setPerspective(60, webCanvas.width/webCanvas.height, .1, 50); // (degrees wide, aspect ratio, near plane, far plane)
 gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
}

function RenderMyShapes(){

 viewMat.setLookAt(g_eye.elements[0], g_eye.elements[1], g_eye.elements[2], 
          g_at.elements[0], g_at.elements[1], g_at.elements[2], 
          g_up.elements[0], g_up.elements[1], g_up.elements[2] );
 gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

 for (let i = 0; i < worldShapes.length; i++) {
  worldShapes[i].render();
 }
}