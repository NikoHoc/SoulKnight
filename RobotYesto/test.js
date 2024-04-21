function main() {
  var CANVAS = document.getElementById("myCanvas");

  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;

  var drag = false;
  var x_prev = 0;
  var y_prev = 0;

  var dx = 0;
  var dy = 0;

  var alpha = 0;
  var theta = 0;

  var friction = 0.98;

  var mouseDown = function (e) {
    drag = true;
    x_prev = e.pageX;
    y_prev = e.pageY;
    console.log("DOWN");
  };
  var mouseUP = function (e) {
    drag = false;
    console.log("UP");
  };
  var mouseOut = function (e) {
    console.log("OUTTT");
  };
  var mouseMove = function (e) {
    if (!drag) {
      return false;
    }

    dx = e.pageX - x_prev;
    dy = e.pageY - y_prev;

    console.log(dx + " " + dy);
    x_prev = e.pageX;
    y_prev = e.pageY;

    theta += (dx * 2 * Math.PI) / CANVAS.width;
    alpha += (dy * 2 * Math.PI) / CANVAS.height;
  };

  CANVAS.addEventListener("mousedown", mouseDown, false);
  CANVAS.addEventListener("mouseup", mouseUP, false);
  CANVAS.addEventListener("mouseout", mouseOut, false);
  CANVAS.addEventListener("mousemove", mouseMove, false);

  var GL;
  try {
    GL = CANVAS.getContext("webgl", { antialias: true });
    var EXT = GL.getExtension("OES_element_index_uint");
  } catch (e) {
    alert("WebGL context cannot be initialized");
    return false;
  }

  //shaders
  var shader_vertex_source = `
                  attribute vec3 position;
                  attribute vec3 color;
              
                  uniform mat4 PMatrix;
                  uniform mat4 VMatrix;
                  uniform mat4 MMatrix;
                  
                  varying vec3 vColor;
                  void main(void) {
                  gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
                  vColor = color;
                  }`;
  var shader_fragment_source = `
                  precision mediump float;
                  varying vec3 vColor;
                  // uniform vec3 color;
                  void main(void) {
                  gl_FragColor = vec4(vColor, 1.);
                  
                  }`;
  var compile_shader = function (source, type, typeString) {
    var shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);
    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
      alert("ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader));
      return false;
    }
    return shader;
  };

  var shader_vertex = compile_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
  var shader_fragment = compile_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

  var SHADER_PROGRAM = GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);

  GL.linkProgram(SHADER_PROGRAM);

  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

  //uniform
  var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
  var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
  var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);
  GL.useProgram(SHADER_PROGRAM);

  /*========================= BODY ========================= */
  // x, y, z, width, height, depth, color
  var cubeData = generateCube(0, -3.27, 0, 3.95, 3.5, 2, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData.colors), GL.STATIC_DRAW);

  var CUBE_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData.faces), GL.STATIC_DRAW);

  /*========================= BODY ========================= */
  /*========================= Legs ========================= */
  // thigh
  // x, y, z, width, height, depth, color
  var cubeData5 = generateCube(1.37, -5.71, 0.15, 1, 1.35, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX5 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX5);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData5.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS5 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS5);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData5.colors), GL.STATIC_DRAW);

  var CUBE_FACES5 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES5);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData5.faces), GL.STATIC_DRAW);

  // x, y, z, width, height, depth, color
  var cubeData6 = generateCube(-1.37, -5.71, 0.15, 1, 1.35, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX6 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX6);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData6.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS6 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS6);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData6.colors), GL.STATIC_DRAW);

  var CUBE_FACES6 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES6);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData6.faces), GL.STATIC_DRAW);

  // Legs
  // x, y, z, width, height, depth, color
  var cubeData7 = generateCube(1.37, -7, 0.15, 0.8, 1.35, 0.8, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX7 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX7);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData7.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS7 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS7);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData7.colors), GL.STATIC_DRAW);

  var CUBE_FACES7 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES7);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData7.faces), GL.STATIC_DRAW);

  // x, y, z, width, height, depth, color
  var cubeData8 = generateCube(-1.37, -7, 0.15, 0.8, 1.35, 0.8, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX8 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX8);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData8.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS8 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS8);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData8.colors), GL.STATIC_DRAW);

  var CUBE_FACES8 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES8);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData8.faces), GL.STATIC_DRAW);

  // Foot
  // x, y, z, width, height, depth, color
  var cubeData9 = generateCube(1.37, -7.9, 0.3, 1, 0.5, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX9 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX9);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData9.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS9 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS9);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData9.colors), GL.STATIC_DRAW);

  var CUBE_FACES9 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES9);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData9.faces), GL.STATIC_DRAW);

  // x, y, z, width, height, depth, color
  var cubeData10 = generateCube(-1.37, -7.9, 0.3, 1, 0.5, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX10 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX10);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData10.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS10 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS10);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData10.colors), GL.STATIC_DRAW);

  var CUBE_FACES10 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES10);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData10.faces), GL.STATIC_DRAW);
  /*========================= Legs ========================= */

  /*========================= WEAPON ========================= */
  // x, y, z, outerRadius, innerRadius, height, segments, color
  var tabung = generateTabung(-2.8, -4.3, 1.3, 0.5, 1, 5, 8, [90 / 256, 130 / 256, 143 / 256]);

  var tabungVertex = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, tabungVertex);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tabung.vertices), GL.STATIC_DRAW);

  var tabungColors = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, tabungColors);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tabung.colors), GL.STATIC_DRAW);

  var tabungFaces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tabungFaces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabung.faces), GL.STATIC_DRAW);

  // eyes of gun
  // x, y, z, radius, segments
  var gun = generateSphere(-2.8, -4.3, 3.7, 0.7, 16);

  // Create buffers for the sphere
  var gunVertex = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, gunVertex);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(gun.vertices), GL.STATIC_DRAW);

  var gunColors = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, gunColors);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(gun.colors), GL.STATIC_DRAW);

  var gunFaces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gunFaces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(gun.faces), GL.STATIC_DRAW);
  /*========================= WEAPON ========================= */

  /*========================= MATRIX ========================= */
  var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEW_MATRIX, -15);

  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var animate = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    time *= 0.003;

    if (!drag) {
      dx *= friction;
      dy *= friction;

      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }

    /*========================= TIME ========================= */

    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    /*========================= BODY ========================= */
    // Draw cube
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, cubeData.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= BODY ========================= */

    /*========================= Legs ========================= */
    // thigh
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX5);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS5);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES5);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, cubeData5.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX6);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS6);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES6);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, cubeData6.faces.length, GL.UNSIGNED_SHORT, 0);

    // Right leg
    var MODEL_MATRIX_RIGHT_LEG = LIBS.get_I4();
    var rightLegMovement = Math.abs(Math.sin((time * 2 * Math.PI) / 15)); // Vertical movement for 15 seconds
    var rightLegOffset = rightLegMovement * 0.5; // Adjust this value to control the range of motion
    LIBS.translateY(MODEL_MATRIX_RIGHT_LEG, rightLegOffset); // Apply vertical translation to right leg
    MODEL_MATRIX_RIGHT_LEG = LIBS.multiply(MODEL_MATRIX, MODEL_MATRIX_RIGHT_LEG);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX7);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS7);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES7);

    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX_RIGHT_LEG);

    GL.drawElements(GL.TRIANGLES, cubeData7.faces.length, GL.UNSIGNED_SHORT, 0);

    // Left leg
    var MODEL_MATRIX_LEFT_LEG = LIBS.get_I4();
    var leftLegMovement = Math.abs(Math.sin((time * 2 * Math.PI) / 15)); // Vertical movement for 15 seconds
    var leftLegOffset = leftLegMovement * 0.5; // Adjust this value to control the range of motion
    LIBS.translateY(MODEL_MATRIX_LEFT_LEG, leftLegOffset); // Apply vertical translation to left leg
    MODEL_MATRIX_LEFT_LEG = LIBS.multiply(MODEL_MATRIX, MODEL_MATRIX_LEFT_LEG);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX8);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS8);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES8);

    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX_LEFT_LEG);

    GL.drawElements(GL.TRIANGLES, cubeData8.faces.length, GL.UNSIGNED_SHORT, 0);

    // Apply the same transformation to the foot cubes
    var MODEL_MATRIX_FOOT = LIBS.get_I4();
    LIBS.translateY(MODEL_MATRIX_FOOT, leftLegOffset); // Assuming left leg movement is used for the foot as well
    MODEL_MATRIX_FOOT = LIBS.multiply(MODEL_MATRIX, MODEL_MATRIX_FOOT);

    // Foot
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX9);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS9);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES9);

    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX_FOOT); // Use the transformed matrix for the foot

    GL.drawElements(GL.TRIANGLES, cubeData9.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX10);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS10);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES10);

    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX_FOOT); // Use the transformed matrix for the foot

    GL.drawElements(GL.TRIANGLES, cubeData10.faces.length, GL.UNSIGNED_SHORT, 0);

    /*========================= Legs ========================= */

    /*========================= WEAPONS ========================= */
    GL.bindBuffer(GL.ARRAY_BUFFER, tabungVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tabungColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tabungFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, tabung.faces.length, GL.UNSIGNED_SHORT, 0);

    // Eye of gun
    var MODEL_MATRIX_GUN_EYE = LIBS.get_I4();
    var gunEyeMovement = Math.abs(Math.sin((time * 2 * Math.PI) / 5)); // Sinusoidal motion for 5 seconds
    var gunEyeOffset = gunEyeMovement * 5; // Adjust this value to control the range of motion
    LIBS.translateZ(MODEL_MATRIX_GUN_EYE, gunEyeOffset); // Apply sinusoidal translation to gun eye along Z-axis
    MODEL_MATRIX_GUN_EYE = LIBS.multiply(MODEL_MATRIX, MODEL_MATRIX_GUN_EYE);

    GL.bindBuffer(GL.ARRAY_BUFFER, gunVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, gunColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gunFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX_GUN_EYE);

    GL.drawElements(GL.TRIANGLES, gun.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= WEAPONS ========================= */

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener("load", main);
