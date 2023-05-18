class Cube {
 constructor() {
  this.type = 'cube';
  this.color = [1.0, 1.0, 1.0, 1.0];
  this.matrix = new Matrix4();
  this.textureSort = -2;
  
  const sideLength = 1.0;
  
  this.vertices = [
    // Front
   -sideLength , -sideLength , -sideLength ,
    sideLength , sideLength , -sideLength ,
    sideLength , -sideLength , -sideLength ,
   -sideLength , -sideLength , -sideLength ,
   -sideLength , sideLength , -sideLength ,
    sideLength , sideLength , -sideLength ,
   
   // Left
   -sideLength , -sideLength , sideLength ,
   -sideLength , sideLength , -sideLength ,
   -sideLength , -sideLength , -sideLength ,
   -sideLength , -sideLength , sideLength ,
   -sideLength , sideLength , sideLength ,
   -sideLength , sideLength , -sideLength ,

   // Top
   -sideLength , sideLength , -sideLength ,
    sideLength , sideLength , sideLength ,
    sideLength , sideLength , -sideLength ,
   -sideLength , sideLength , -sideLength ,
   -sideLength , sideLength , sideLength ,
    sideLength , sideLength , sideLength ,
    
    // Back
    sideLength , -sideLength , sideLength ,
    -sideLength , sideLength , sideLength ,
    -sideLength , -sideLength , sideLength ,
    sideLength , -sideLength , sideLength ,
    sideLength , sideLength , sideLength ,
    -sideLength , sideLength , sideLength ,
    
    // Right
    sideLength , -sideLength , -sideLength ,
    sideLength , sideLength , sideLength ,
    sideLength , -sideLength , sideLength ,
    sideLength , -sideLength , -sideLength ,
    sideLength , sideLength , -sideLength ,
    sideLength , sideLength , sideLength ,
    
    // Bottom
    -sideLength , -sideLength , -sideLength ,
    sideLength , -sideLength , sideLength ,
    sideLength , -sideLength , -sideLength ,
    -sideLength , -sideLength , -sideLength ,
    -sideLength , -sideLength , sideLength ,
    sideLength , -sideLength , sideLength ,
];

  this.uvCoords = [
   // Front
   0, 0,
   1, 1,
   1, 0,
   0, 0,
   0, 1,
   1, 1,

   // Left
   0, 0,
   1, 1,
   1, 0,
   0, 0,
   0, 1,
   1, 1,

   // Top
   0, 0,
   1, 1,
   1, 0,
   0, 0,
   0, 1,
   1, 1,

   // Back
   0, 0,
   1, 1,
   1, 0,
   0, 0,
   0, 1,
   1, 1,

   // Right
   0, 0,
   1, 1,
   1, 0,
   0, 0,
   0, 1,
   1, 1,

   // Bottom
   0, 0,
   1, 1,
   1, 0,
   0, 0,
   0, 1,
   1, 1,
  ];
 }

 render() {
  // Pass the color to u_FragColor variable
  var rgba = this.color;
  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

  gl.uniform1i(u_TextureType, this.textureType);

  gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

  // Combinevertices and UV coordinates into a single interleaved array
  var interleavedArray = [];
  for (var i = 0; i < this.vertices.length / 3; i++) {
   var vertexIndex = i * 3;
   var uvIndex = i * 2;
   interleavedArray.push(
    this.vertices[vertexIndex],
    this.vertices[vertexIndex + 1],
    this.vertices[vertexIndex + 2],
    this.uvCoords[uvIndex],
    this.uvCoords[uvIndex + 1]
   );
  }

  drawCubeUV(interleavedArray);
 }
}

function drawCubeUV(vertices) {
 var n = 36; 

 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

 gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 5 * FLOAT_SIZE, 0);
 gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 5 * FLOAT_SIZE, 3 * FLOAT_SIZE);

 gl.enableVertexAttribArray(a_Position);
 gl.enableVertexAttribArray(a_UV);

 gl.drawArrays(gl.TRIANGLES, 0, n);
}
