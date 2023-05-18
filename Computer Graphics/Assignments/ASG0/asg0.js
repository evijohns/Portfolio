function main() {
 // Retrieve <canvas> element
 canvas = document.getElementById('cnv1');

 if (!canvas) {
  console.log('Failed to retrieve the <canvas> element');
  return;
 }

 // Get the rendering context for 2DCG
 ctx = canvas.getContext('2d');

 // Set the background color of the canvas to black
 ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Define function to draw a vector on canvas
function drawVector(v, color) {
 ctx.beginPath();
 ctx.moveTo(200, 200);
 ctx.lineTo(200 + v.elements[0] * 20, 200 - v.elements[1] * 20);
 ctx.strokeStyle = color;
 ctx.stroke();
}

function areaTriangle(v1, v2) {
 const crossProduct = Vector3.cross(v1, v2);
 const area = crossProduct.magnitude() ;
 return area;
}

function handleDrawEvent() {
 // Clear the canvas
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
 ctx.fillRect(0, 0, canvas.width, canvas.height);

 // Read the values of the text boxes to create v1
 var v1xCoord = parseFloat(document.getElementById('v1xCoord').value);
 var v1yCoord = parseFloat(document.getElementById('v1yCoord').value);
 v1 = new Vector3([v1xCoord, v1yCoord, 0]);
 console.log('v1:', v1); // add console.log statement
 // Draw v1 on canvas
 drawVector(v1, "red");

 // Read the values of the text boxes to create v2
 var v2xCoord = parseFloat(document.getElementById('v2xCoord').value);
 var v2yCoord = parseFloat(document.getElementById('v2yCoord').value);
 v2 = new Vector3([v2xCoord, v2yCoord, 0]);
 console.log('v2:', v2); // add console.log statement
  // Draw v2 on canvas
 drawVector(v2, "blue");
}

function angleBetween(v1, v2) {
 let dotProduct = Vector3.dot(v1, v2);
 let v1Magnitude = v1.magnitude();
 let v2Magnitude = v2.magnitude();
 let angleRadians = Math.acos(dotProduct / (v1Magnitude * v2Magnitude));
 let angleDegrees = angleRadians * (180 / Math.PI);

 return angleDegrees;
}

function handleDrawOperationEvent() {
 // Clear the canvas
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
 ctx.fillRect(0, 0, canvas.width, canvas.height);

 // Read the values of the text boxes to create v1
 var v1xCoord = parseFloat(document.getElementById('v1xCoord').value);
 var v1yCoord = parseFloat(document.getElementById('v1yCoord').value);
 v1 = new Vector3([v1xCoord, v1yCoord, 0]);
  console.log('v1:', v1); // add console.log statement

 // Draw v1 on canvas
 drawVector(v1, "red");

 // Read the values of the text boxes to create v2
 var v2xCoord = parseFloat(document.getElementById('v2xCoord').value);
 var v2yCoord = parseFloat(document.getElementById('v2yCoord').value);
 v2 = new Vector3([v2xCoord, v2yCoord, 0]);
  console.log('v2:', v2); // add console.log statement

 // Draw v2 on canvas
 drawVector(v2, "blue");

 // Read the value of the selector
 var opSelect = document.getElementById('opSelect').value;
 console.log('opSelect:', opSelect); // add console.log statement

 // Read the value of the number input
 var scalar = parseFloat(document.getElementById('scalar').value);
 console.log('scalar:', scalar); // add console.log statement

 // Perform the operation based on the selector value
 if (opSelect === "Add") {
  var v3 = v1.add(v2);
  console.log("Result of addition: ", v3);
  drawVector(v3, "green");
 } else if (opSelect === "Subtract") {
  var v3 = v1.sub(v2);
  console.log("Result of subtraction: ", v3);
  drawVector(v3, "green");
 } else if (opSelect === "Multiply") {
  var v3 = v1.mul(scalar);
  console.log("Result of mult, v3: ", v3);
  var v4 = v2.mul(scalar);
  console.log("Result of mult, v4: ", v4);
  drawVector(v3, "green");
  drawVector(v4, "green");
 } else if (opSelect === "Divide") {
  var v3 = v1.div(scalar);
  console.log("Result of div, v3: ", v3);
  var v4 = v2.div(scalar);
  console.log("Result of div, v4: ", v4);
  drawVector(v3, "green");
  drawVector(v4, "green");
 } else if (opSelect === "Magnitude"){
  let v1Magnitude = v1.magnitude();
  let v2Magnitude = v2.magnitude();
  console.log("Magnitude of v1: " + v1Magnitude);
  console.log("Magnitude of v2: " + v2Magnitude);
 } else if (opSelect === "Normalize") {
  v1.normalize();
  v2.normalize();
  drawVector(v1, "green");
  drawVector(v2, "green");
 } else if (opSelect === "Angle Between") {
  let angle = angleBetween(v1, v2);
  console.log("Angle between: " + angle);
 } else if (opSelect === "Area") {
  let area = areaTriangle(v1, v2);
  console.log("Area: " + area);
 }
}
