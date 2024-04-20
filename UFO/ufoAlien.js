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

    theta += (-dy * 2 * Math.PI) / CANVAS.height; // Update theta based on vertical movement (dy)
    alpha += (dx * 2 * Math.PI) / CANVAS.width; // Update alpha based on horizontal movement (dx)
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

  // ========================== Kepala ==================================
  //bagian dalam
  var kepala1 = generateHalfSphere(0, 0, 2.5, 1.5, 30, [0, 0.45, 0.64]);

  // Create buffers
  var kepala1_vertex = createVertexBuffer(GL, kepala1.vertices);
  var kepala1_colors = createColorBuffer(GL, kepala1.colors);
  var kepala1_faces = createFacesBuffer(GL, kepala1.faces);

  //bagian pola
  var kepala2 = generateHalfSphere(0, 0, 2.9, 1.53, 25, [0.11, 0.88, 0.94]);

  // Create buffers
  var kepala2_vertex = createVertexBuffer(GL, kepala2.vertices);
  var kepala2_colors = createColorBuffer(GL, kepala2.colors);
  var kepala2_faces = createFacesBuffer(GL, kepala2.faces);
  
  

  // ========================== Badan ==================================
  // bagian luar
  var badan1 = generateSolidTube(0, 0, 1, 1.5, 1, 3, 30, [0, 0.45, 0.64]);

  // Create buffers for the first octagon
  var badan1_VERTEX = createVertexBuffer(GL, badan1.vertices);
  var badan1_COLORS = createColorBuffer(GL, badan1.colors);
  var badan1_FACES = createFacesBuffer(GL, badan1.faces);

  // bagian dalam
  var badan2 = generateSolidTube(0, 0, 1, 1, 1.6, 3.2, 7, [0.11, 0.88, 0.94]);

  // Create buffers for the first octagon
  var badan2_VERTEX = createVertexBuffer(GL, badan2.vertices);
  var badan2_COLORS = createColorBuffer(GL, badan2.colors);
  var badan2_FACES = createFacesBuffer(GL, badan2.faces);


  // ========================== Tube Backpack ==================================

  // top backpack
  var topBackpack = generateHalfSphere(2.4, 0, 2.75, 0.65, 30, [0.44, 0.44, 0.52]);
  // Create buffers
  var topBackpack_vertex = createVertexBuffer(GL, topBackpack.vertices);
  var topBackpack_colors = createColorBuffer(GL, topBackpack.colors);
  var topBackpack_faces = createFacesBuffer(GL, topBackpack.faces);

  // body backpack
  var backpack = generateSolidTube(2.4, 0, 1, 0.65, 0.43, 3.5, 30, [0.24, 0.25, 0.29]);
  // Create buffers
  var backpack_vertex = createVertexBuffer(GL, backpack.vertices);
  var backpack_colors = createColorBuffer(GL, backpack.colors);
  var backpack_faces = createFacesBuffer(GL, backpack.faces);


  // backpack aksesoris 2
  var backpack2 = generateSolidTube(2.4, 0, 2.2, 0.67, 0.43, 0.35, 30, [0.09, 1, 0.99]);
  // Create buffers
  var backpack2_vertex = createVertexBuffer(GL, backpack2.vertices);
  var backpack2_colors = createColorBuffer(GL, backpack2.colors);
  var backpack2_faces = createFacesBuffer(GL, backpack2.faces);

  // backpack aksesoris 3
  var backpack3 = generateSolidTube(2.4, 0, 1.85, 0.67, 0.43, 0.35, 30, [0.17, 0.84, 0.83]);
  // Create buffers
  var backpack3_vertex = createVertexBuffer(GL, backpack3.vertices);
  var backpack3_colors = createColorBuffer(GL, backpack3.colors);
  var backpack3_faces = createFacesBuffer(GL, backpack3.faces);

  // backpack aksesoris 4
  var backpack4 = generateSolidTube(2.4, 0, 1, 0.67, 0.43, 0.35, 30, [0.17, 0.84, 0.83]);
  // Create buffers
  var backpack4_vertex = createVertexBuffer(GL, backpack4.vertices);
  var backpack4_colors = createColorBuffer(GL, backpack4.colors);
  var backpack4_faces = createFacesBuffer(GL, backpack4.faces);

  // bottom backpack
  var bottomBackpack = generateHalfSphere(2.4, 0, -0.65, -0.65, 30, [0.44, 0.44, 0.52]);
  // Create buffers
  var bottomBackpack_vertex = createVertexBuffer(GL, bottomBackpack.vertices);
  var bottomBackpack_colors = createColorBuffer(GL, bottomBackpack.colors);
  var bottomBackpack_faces = createFacesBuffer(GL, bottomBackpack.faces);
  

  // ========================== UFO ==================================
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

  // UFO3
  // bottom UFO
  var botUFO = generateHalfSphere(0, 0, 0.4, -2.4, 30, [0.24, 0.25, 0.29]);

  // Create buffers
  var botUFO_vertex = createVertexBuffer(GL, botUFO.vertices);
  var botUFO_colors = createColorBuffer(GL, botUFO.colors);
  var botUFO_faces = createFacesBuffer(GL, botUFO.faces);

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
  LIBS.translateZ(VIEW_MATRIX, -30);

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

    // kepala1
    GL.bindBuffer(GL.ARRAY_BUFFER, kepala1_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepala1_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepala1_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      kepala1.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // kepala2
    GL.bindBuffer(GL.ARRAY_BUFFER, kepala2_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepala2_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepala2_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLES,
      kepala2.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // badan 1
    GL.bindBuffer(GL.ARRAY_BUFFER, badan1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, badan1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, badan1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      badan1.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // badan 2
    GL.bindBuffer(GL.ARRAY_BUFFER, badan2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, badan2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, badan2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      badan2.faces.length,
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

    //Bot UFO

     GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_vertex);
     GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
 
     GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_colors);
     GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
 
     GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, botUFO_faces);
 
     GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
     GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
     GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
 
     GL.drawElements(
       GL.TRIANGLE_STRIP,
       botUFO.faces.length,
       GL.UNSIGNED_SHORT,
       0
     );

     

    // Draw bagian top backpack
    GL.bindBuffer(GL.ARRAY_BUFFER, topBackpack_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, topBackpack_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, topBackpack_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      topBackpack.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );


    // Draw backpack (main)
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      backpack.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Draw aksesoris backpack 2
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack2_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack2_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack2_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      backpack2.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Draw aksesoris backpack 3
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack3_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack3_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack3_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      backpack3.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Draw aksesoris backpack 4
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack4_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack4_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack4_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      backpack4.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Draw bagian bottom backpack
    GL.bindBuffer(GL.ARRAY_BUFFER, bottomBackpack_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, bottomBackpack_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bottomBackpack_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      bottomBackpack.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener("load", main);
