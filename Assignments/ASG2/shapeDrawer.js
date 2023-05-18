function drawAllShapes() {
  var bodyColor = [0.0, 0.6, 0.0, 1.0];  // dark green color
  var skinColor = [0.6, 1.0, 0.4, 1.0];  // light green color
  var shellColor = [0.6, 0.3, 0.0, 1.0]; // Brown color
 
  // Mythical creatures body =================================================================
  var body = new Cube();
  body.color = bodyColor;
  body.matrix.scale(0.3, 0.075, 0.2); // Make body half the thickness
  body.matrix.translate(-0.5, -0.625, -0.25); // Move the body up
  body.render();

  // Mythical creatures shell =================================================================
  var shell = new Cube();
  shell.color = shellColor;
  shell.matrix.scale(0.3, 0.1, 0.35); // Adjust the shell's size
  shell.matrix.translate(-0.5, 0.25, -0.35); // Lower the shell to touch the body
  shell.render();
  
  // half-sphere on top of the shell horn =================================================================
 
  var halfSphere = new HalfSphere();
  halfSphere.color = shellColor;
  halfSphere.matrix.rotate(-animator, 1, 0, 0);
  // Adjust the scale if necessary
  halfSphere.matrix.scale(0.175, 0.1, 0.35);
  // Adjust the translation to align the half-sphere with the shell cube
  halfSphere.matrix.translate(0, 2, 0);
  // Rotate the half sphere by 45 degrees around the y-axis
  halfSphere.matrix.rotate(45, 0, 1, 0);
  // Scale the half sphere by 90% in all dimensions
  halfSphere.matrix.scale(0.9, 0.9, 0.9);
  halfSphere.render();

  // Mythical creature head =================================================================
  var head = new Cube();
  head.color = skinColor;
  head.matrix.rotate(-animator, 1, 0, 0);
  head.matrix.scale(0.15, 0.15, 0.15);
  head.matrix.translate(-0.5, 0.7, -1.25); // Lower the head to match the shell
  head.render();
  
  // Mythical creature eyes =================================================================
  var leftEye = new Cube();
  leftEye.color = [1.0, 1.0, 1.0, 1.0]; // set color to white
  leftEye.matrix.rotate(-animator, 1, 0, 0);
  leftEye.matrix.scale(0.05, 0.05, 0.05); // Scale down the size of the eye
  leftEye.matrix.translate(-1.2, 2.7, -4); // Translate the left eye to the front of the head
  leftEye.render();
  
  var rightEye = new Cube();
  rightEye.color = [1.0, 1.0, 1.0, 1.0]; // set color to white
  rightEye.matrix.rotate(-animator, 1, 0, 0);
  rightEye.matrix.scale(0.05, 0.05, 0.05); // Translate the right eye to the front of the head
  rightEye.matrix.translate(0, 2.7, -4); // Scale down the size of the eye
  rightEye.render();


  // Mythical creature legs =================================================================
  var legs = [];
  var legMatrixs = [];  

  for (var i = 0; i < 4; i++) {
    legs[i] = new Cube();
    legs[i].color = bodyColor;
    legs[i].matrix.setTranslate(0, 0, 0);

    // This will affect the joint 1
    legs[i].matrix.rotate((i < 2) ? -angleJoints : angleJoints, 0, 0, 1); 
    legMatrixs[i] = new Matrix4(legs[i].matrix);
    legs[i].matrix.scale(0.05, -0.15, 0.05); // Make legs longer
    legs[i].matrix.translate((i % 2 == 0) ? -1.15 : 0.2, -0.15, (i < 2) ? -0.75 : 1.5);
    legs[i].render();
  }

  // Mythical creature bottom of legs=================================================================
  var bottomLegs = [];

  for (var i = 0; i < 4; i++) {
    bottomLegs[i] = new Cube();
    bottomLegs[i].color = skinColor;
    bottomLegs[i].matrix = legMatrixs[i];

    // This will affect the joint 2
    bottomLegs[i].matrix.rotate((i < 2) ? -angleJoints2 : angleJoints2, 0, 0, 1);
    bottomLegs[i].matrix.scale(0.04, 0.12, 0.04); // Make lower legs longer
    bottomLegs[i].matrix.translate((i % 2 == 0) ? -1.25 : 0.37, -2.0, (i < 2) ? -0.8 : 2);
    bottomLegs[i].render();
  }
}

