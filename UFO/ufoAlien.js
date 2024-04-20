import { generateHalfSphere } from "./components/generateHalfSphere.js";
import { generateSolidTube } from "./components/generateTubes.js";
import { generateUfoOutline } from "./components/generateUFO.js";
import { generateUfo } from "./components/generateUFO.js";

function createVertexBuffer(GL, data) {
  var buffer = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);
  return buffer;
}

function createColorBuffer(GL, data) {
  var buffer = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(data), GL.STATIC_DRAW);
  return buffer;
}

function createFacesBuffer(GL, data) {
  var buffer = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), GL.STATIC_DRAW);
  return buffer;
}

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
  var theta = Math.PI / 2;

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
      alert(
        "ERROR IN " + typeString + " SHADER: " + GL.getShaderInfoLog(shader)
      );
      return false;
    }
    return shader;
  };

  var shader_vertex = compile_shader(
    shader_vertex_source,
    GL.VERTEX_SHADER,
    "VERTEX"
  );
  var shader_fragment = compile_shader(
    shader_fragment_source,
    GL.FRAGMENT_SHADER,
    "FRAGMENT"
  );

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

  // 
  // Kepala
  //
  var halfSphereData = generateHalfSphere(0, 0, 2.5, 1.5, 30, [0, 1, 1]);

  // Create buffers
  var halfSphere_vertex = createVertexBuffer(GL, halfSphereData.vertices);
  var halfSphere_colors = createColorBuffer(GL, halfSphereData.colors);
  var halfSphere_faces = createFacesBuffer(GL, halfSphereData.faces);
  

  //
  // Badan
  //
  var tubeData = generateSolidTube(0, 0, 1, 1.5, 1, 3, 30, [0, 1, 1]);

  // Create buffers for the first octagon
  var SOLID_TUBES_VERTEX = createVertexBuffer(GL, tubeData.vertices);
  var SOLID_TUBES_COLORS = createColorBuffer(GL, tubeData.colors);
  var SOLID_TUBES_FACES = createFacesBuffer(GL, tubeData.faces);


  //
  //Tube backpack 
  //
  var tubeData2 = generateSolidTube(2.2, 0, 1, 0.65, 0.4, 3, 30, [0.4, 0.4, 0.4]);

  // Create buffers
  var SOLID_TUBES2_VERTEX = createVertexBuffer(GL, tubeData2.vertices);
  var SOLID_TUBES2_COLORS = createColorBuffer(GL, tubeData2.colors);
  var SOLID_TUBES2_FACES = createFacesBuffer(GL, tubeData2.faces);



  //
  // Mata
  //

  //
  // UFO
  //

  // UFO1
  var ufo1 = generateUfoOutline(2.5, 2.5, 1.2, 40);

  // Create buffers
  var ufo1_vertex = createVertexBuffer(GL, ufo1.vertices);
  var ufo1_colors = createColorBuffer(GL, ufo1.colors);
  var ufo1_faces = createFacesBuffer(GL, ufo1.faces);

  // UFO2
  var ufo2 = generateUfo(2.2, 2.2, 1.5, 40);

  // Create buffers
  var ufo2_vertex = createVertexBuffer(GL, ufo2.vertices);
  var ufo2_colors = createColorBuffer(GL, ufo2.colors);
  var ufo2_faces = createFacesBuffer(GL, ufo2.faces);


  //matrix
  var PROJECTION_MATRIX = LIBS.get_projection(
    40,
    CANVAS.width / CANVAS.height,
    1,
    100
  );
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();

  LIBS.rotateY(VIEW_MATRIX, Math.PI / 2);
  LIBS.rotateX(VIEW_MATRIX, Math.PI / 2);
  LIBS.translateZ(VIEW_MATRIX, -20);

  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var time_prev = 0;
  var animate = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    var dt = time - time_prev;
    time_prev = time;

    if (!drag) {
      dx *= friction;
      dy *= friction;

      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }

    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    //gambar ellip kepala
    GL.bindBuffer(GL.ARRAY_BUFFER, halfSphere_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, halfSphere_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, halfSphere_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      halfSphereData.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Draw tuba untuk badan
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_TUBES_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      tubeData.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    //gambar ufo1
    GL.bindBuffer(GL.ARRAY_BUFFER, ufo1_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, ufo1_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ufo1_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, ufo1.faces.length, GL.UNSIGNED_SHORT, 0);

    //gambar ufo2
    GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ufo2_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      ufo2.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Draw tuba untuk backpack
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_TUBES2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      tubeData2.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener("load", main);
