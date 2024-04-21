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

  /*========================= HEAD ========================= */
  // top part of robot head
  // x, y, z, outerRadius, innerRadius, height, segments, color
  var solidOctagonData = generateSolidOctagon(0, 0.85, 0, 2, 1, 1.3, 8, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the first octagon
  var SOLID_OCTAGON_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(solidOctagonData.vertices), GL.STATIC_DRAW);

  var SOLID_OCTAGON_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(solidOctagonData.colors), GL.STATIC_DRAW);

  var SOLID_OCTAGON_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_OCTAGON_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(solidOctagonData.faces), GL.STATIC_DRAW);

  // middle part of robot head
  var solidOctagonData2 = generateSolidOctagon(0, -0.15, 0, 1, 1.6, 0.7, 8, [0, 0, 0]);

  // Create buffers for the second octagon
  var SOLID_OCTAGON_VERTEX_2 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_VERTEX_2);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(solidOctagonData2.vertices), GL.STATIC_DRAW);

  var SOLID_OCTAGON_COLORS_2 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_COLORS_2);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(solidOctagonData2.colors), GL.STATIC_DRAW);

  var SOLID_OCTAGON_FACES_2 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_OCTAGON_FACES_2);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(solidOctagonData2.faces), GL.STATIC_DRAW);

  // bottom part of robot head
  var solidOctagonData3 = generateSolidOctagon(0, -1, 0, 2, 1, 1, 8, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the third octagon
  var SOLID_OCTAGON_VERTEX_3 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_VERTEX_3);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(solidOctagonData3.vertices), GL.STATIC_DRAW);

  var SOLID_OCTAGON_COLORS_3 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_COLORS_3);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(solidOctagonData3.colors), GL.STATIC_DRAW);

  var SOLID_OCTAGON_FACES_3 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_OCTAGON_FACES_3);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(solidOctagonData3.faces), GL.STATIC_DRAW);
  /*========================= HEAD ========================= */

  /*========================= MATA ========================= */
  // eyes of robot head
  var sphereData = generateSphere(0, -0.15, 1.82, 0.4, 16);

  // Create buffers for the sphere
  var SPHERE_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SPHERE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sphereData.vertices), GL.STATIC_DRAW);

  var SPHERE_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SPHERE_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(sphereData.colors), GL.STATIC_DRAW);

  var SPHERE_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SPHERE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereData.faces), GL.STATIC_DRAW);
  /*========================= MATA ========================= */

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

  // x, y, z, width, height, depth, color
  var cubeData4 = generateCube(0, -5.2, 0, 1.7, 0.5, 2, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX4 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX4);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData4.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS4 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS4);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData4.colors), GL.STATIC_DRAW);

  var CUBE_FACES4 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES4);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData4.faces), GL.STATIC_DRAW);
  /*========================= BODY ========================= */

  /*========================= Armor Plate ========================= */
  var cubeData2 = generateCube(0, -3.15, 1.2, 3.5, 2.7, 0.7, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX2 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX2);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData2.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS2 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS2);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData2.colors), GL.STATIC_DRAW);

  var CUBE_FACES2 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES2);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData2.faces), GL.STATIC_DRAW);

  /*========================= Armor Plate ========================= */

  /*========================= Shoulder ========================= */
  // x, y, z, radius, width, length, segments, right, rgbColor
  // Right shoulder
  var shoulderDataRight = generateShoulder(1.95, -3, 0, 1.3, 1, 1.4, 50, true, [172 / 256, 189 / 256, 190 / 256]);

  var SHOULDER_VERTEX_RIGHT = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_VERTEX_RIGHT);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shoulderDataRight.vertices), GL.STATIC_DRAW);

  var SHOULDER_COLORS_RIGHT = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_COLORS_RIGHT);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shoulderDataRight.colors), GL.STATIC_DRAW);

  var SHOULDER_FACES_RIGHT = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SHOULDER_FACES_RIGHT);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(shoulderDataRight.faces), GL.STATIC_DRAW);

  // Left shoulder
  var shoulderDataLeft = generateShoulder(-1.95, -3, 0, 1.3, 1, 1.4, 50, false, [172 / 256, 189 / 256, 190 / 256]);

  var SHOULDER_VERTEX_LEFT = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_VERTEX_LEFT);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shoulderDataLeft.vertices), GL.STATIC_DRAW);

  var SHOULDER_COLORS_LEFT = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_COLORS_LEFT);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(shoulderDataLeft.colors), GL.STATIC_DRAW);

  var SHOULDER_FACES_LEFT = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SHOULDER_FACES_LEFT);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(shoulderDataLeft.faces), GL.STATIC_DRAW);
  /*========================= Shoulder ========================= */

  /*========================= Hands ========================= */
  // x, y, z, width, height, depth, color
  var cubeData3 = generateCube(2.6, -3.55, 0.1, 0.8, 2.2, 0.67, [66 / 256, 94 / 256, 96 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX3 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX3);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData3.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS3 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS3);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData3.colors), GL.STATIC_DRAW);

  var CUBE_FACES3 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES3);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData3.faces), GL.STATIC_DRAW);

  // kiri (dri depan)
  var cubeData11 = generateCube(-2.6, -3.25, 0.1, 0.8, 1, 0.67, [66 / 256, 94 / 256, 96 / 256]);

  // Create buffers for the cube
  var CUBE_VERTEX11 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX11);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData11.vertices), GL.STATIC_DRAW);

  var CUBE_COLORS11 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS11);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cubeData11.colors), GL.STATIC_DRAW);

  var CUBE_FACES11 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES11);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeData11.faces), GL.STATIC_DRAW);
  /*========================= Hands ========================= */

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

    time *= 0.009;

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

    /*========================= HEAD ========================= */
    // Draw first octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_OCTAGON_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, solidOctagonData.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw second octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_VERTEX_2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_COLORS_2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_OCTAGON_FACES_2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, solidOctagonData2.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw third octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_VERTEX_3);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_OCTAGON_COLORS_3);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_OCTAGON_FACES_3);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, solidOctagonData3.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= HEAD ========================= */

    /*========================= MATA ========================= */
    // Draw sphere
    GL.bindBuffer(GL.ARRAY_BUFFER, SPHERE_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SPHERE_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SPHERE_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, sphereData.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= MATA ========================= */

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

    // Bottom
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX4);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS4);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES4);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, cubeData4.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= BODY ========================= */

    /*========================= Armor Plate ========================= */
    // Draw Squircle
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, cubeData2.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= Armor Plate ========================= */

    /*========================= SHOULDERS ========================= */
    // Draw right shoulder
    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_VERTEX_RIGHT);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_COLORS_RIGHT);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SHOULDER_FACES_RIGHT);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, shoulderDataRight.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw left shoulder
    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_VERTEX_LEFT);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_COLORS_LEFT);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SHOULDER_FACES_LEFT);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, shoulderDataLeft.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= SHOULDERS ========================= */

    /*========================= Hands ========================= */
    // Draw Hands
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX3);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS3);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES3);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, cubeData3.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX11);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_COLORS11);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES11);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, cubeData11.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= Hands ========================= */

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

    // eye of gun
    // Draw sphere
    GL.bindBuffer(GL.ARRAY_BUFFER, gunVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, gunColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gunFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLES, gun.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= WEAPONS ========================= */

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener("load", main);
