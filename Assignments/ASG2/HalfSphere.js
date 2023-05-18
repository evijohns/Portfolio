class HalfSphere {
 constructor() {
  this.color = [1.0, 1.0, 1.0, 1.0];
  this.matrix = new Matrix4();
  this.slices = 10;
  this.stacks = 5;
  this.vertices = this.computeVertices();
 }

 computeVertices() {
  let vertices = [];

  for (let i = 0; i < this.stacks; ++i) {
   let stackAngle1 = (Math.PI ) * (i / this.stacks);
   let stackAngle2 = (Math.PI ) * ((i + 1) / this.stacks);
   let stackRadius1 = Math.sin(stackAngle1);
   let stackRadius2 = Math.sin(stackAngle2);
   let stackY1 = Math.cos(stackAngle1);
   let stackY2 = Math.cos(stackAngle2);

   for (let j = 0; j < this.slices; ++j) {
    let sliceAngle1 = 2 * Math.PI * (j / this.slices);
    let sliceAngle2 = 2 * Math.PI * ((j + 1) / this.slices);

    let x11 = stackRadius1 * Math.cos(sliceAngle1);
    let z11 = stackRadius1 * Math.sin(sliceAngle1);
    let x12 = stackRadius1 * Math.cos(sliceAngle2);
    let z12 = stackRadius1 * Math.sin(sliceAngle2);

    let x21 = stackRadius2 * Math.cos(sliceAngle1);
    let z21 = stackRadius2 * Math.sin(sliceAngle1);
    let x22 = stackRadius2 * Math.cos(sliceAngle2);
    let z22 = stackRadius2 * Math.sin(sliceAngle2);

    vertices.push([x11, stackY1, z11, x12, stackY1, z12, x21, stackY2, z21]);
    vertices.push([x12, stackY1, z12, x22, stackY2, z22, x21, stackY2, z21]);
   }
  }

  return vertices;
 }

 render() {
  let rgba = this.color;

  // Pass the color of a point to u_FragColor variable
  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

  // Pass the matrix to u_ModelMatrix attribute
  gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

  for (let i = 0; i < this.vertices.length; ++i) {
   drawTriangle3D(this.vertices[i]);
  }

  gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
 }
}
