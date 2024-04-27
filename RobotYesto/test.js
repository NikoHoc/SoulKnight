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

  var mouseDown = function (e) {
    drag = true;
    x_prev = e.pageX;
    y_prev = e.pageY;
  };
  var mouseUP = function (e) {
    drag = false;
  };
  var mouseMove = function (e) {
    if (!drag) {
      return false;
    }

    dx = e.pageX - x_prev;
    dy = e.pageY - y_prev;
    x_prev = e.pageX;
    y_prev = e.pageY;

    theta += (dx * 2 * Math.PI) / CANVAS.width;
    alpha += (dy * 2 * Math.PI) / CANVAS.height;
  };

  CANVAS.addEventListener("mousedown", mouseDown, false);
  CANVAS.addEventListener("mouseup", mouseUP, false);

  CANVAS.addEventListener("mousemove", mouseMove, false);

  var GL;
  try {
    GL = CANVAS.getContext("webgl", { antialias: true });
  } catch (e) {
    alert("WebGL context cannot be initialized");
    return false;
  }

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
  var _PMatrix = GL.getUniformLocation(SHADER_PROGRAM, "PMatrix"); //projection
  var _VMatrix = GL.getUniformLocation(SHADER_PROGRAM, "VMatrix"); //View
  var _MMatrix = GL.getUniformLocation(SHADER_PROGRAM, "MMatrix"); //Model

  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);
  GL.useProgram(SHADER_PROGRAM);

  /*========================= BODY ========================= */
  var MAIN_BODY = generateCube(0, -3.27, 0, 3.95, 3.5, 2, [100 / 256, 140 / 256, 139 / 256]);

  var MAIN_BODY_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(MAIN_BODY.vertices), GL.STATIC_DRAW);

  var MAIN_BODY_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(MAIN_BODY.colors), GL.STATIC_DRAW);

  var MAIN_BODY_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MAIN_BODY_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(MAIN_BODY.faces), GL.STATIC_DRAW);
  /*========================= BODY ========================= */

  /*========================= Shoulder ========================= */
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
  var HANDS_LEFT = generateCube(-2.6, -3.25, 0.1, 0.8, 1, 0.67, [66 / 256, 94 / 256, 96 / 256]);

  var HANDS_LEFT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_LEFT.vertices), GL.STATIC_DRAW);

  var HANDS_LEFT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_LEFT.colors), GL.STATIC_DRAW);

  var HANDS_LEFT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(HANDS_LEFT.faces), GL.STATIC_DRAW);

  var HANDS_LEFT2 = generateCube(-2.6, -3.5, 1.2, 0.8, 0.5, 1.7, [66 / 256, 94 / 256, 96 / 256]);

  var HANDS_LEFT_VERTEX2 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX2);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_LEFT2.vertices), GL.STATIC_DRAW);

  var HANDS_LEFT_COLORS2 = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS2);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_LEFT.colors), GL.STATIC_DRAW);

  var HANDS_LEFT_FACES2 = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES2);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(HANDS_LEFT2.faces), GL.STATIC_DRAW);
  /*========================= Hands ========================= */

  /*========================= WEAPON ========================= */
  var tabung = generateTabung(-2.59, -3.5, 1.8, 0.1, 0.4, 1.3, 100, [90 / 256, 130 / 256, 143 / 256]);

  var tabungVertex = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, tabungVertex);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tabung.vertices), GL.STATIC_DRAW);

  var tabungColors = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, tabungColors);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(tabung.colors), GL.STATIC_DRAW);

  var tabungFaces = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tabungFaces);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(tabung.faces), GL.STATIC_DRAW);

  var SABER = generateTabung(-2.59, -0.5, 1.8, 0.1, 0.3, 5, 100, [1.0, 0.0, 0]);

  var SABER_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SABER_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(SABER.vertices), GL.STATIC_DRAW);

  var SABER_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, SABER_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(SABER.colors), GL.STATIC_DRAW);

  var SABER_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SABER_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(SABER.faces), GL.STATIC_DRAW);

  var gun = generateSphere(-2.59, 2, 1.8, 0.3, 16);

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

  // badan
  var BADAN_MATRIX = LIBS.get_I4();
  var SABER_MATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEW_MATRIX, -15);
  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var then = 0;

  var SaberTime = 0;
  var SaberReverse = false;

  var animateRobot = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    time *= 0.0005;

    var deltaTime = (time - then) * 100;
    then = time;

    /*========================= TIME ========================= */
    BADAN_MATRIX = LIBS.get_I4();

    SABER_MATRIX = LIBS.get_I4();
    var KF_Saber = 0;

    if (time < 10) {
      if (SaberTime <= -9) {
        SaberReverse = true;
      } else if (SaberTime >= 9) {
        SaberReverse = false;
      }

      if (SaberReverse == true) {
        SaberTime += deltaTime;
      } else {
        SaberTime -= deltaTime;
      }

      KF_Saber = LIBS.degToRad(SaberTime / (Math.PI * 1));
    }

    MODEL_MATRIX = LIBS.get_I4();

    /*========================= ANIMASI ========================= */
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    LIBS.rotateY(BADAN_MATRIX, theta);
    LIBS.rotateX(BADAN_MATRIX, alpha);

    LIBS.rotateX(SABER_MATRIX, KF_Saber);
    LIBS.rotateY(SABER_MATRIX, theta);
    LIBS.rotateX(SABER_MATRIX, alpha);

    /*========================= BODY ========================= */
    GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MAIN_BODY_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, MAIN_BODY.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= BODY ========================= */

    /*========================= SHOULDERS ========================= */
    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_VERTEX_LEFT);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_COLORS_LEFT);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SHOULDER_FACES_LEFT);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, shoulderDataLeft.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= SHOULDERS ========================= */

    /*========================= Hands ========================= */
    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, HANDS_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, HANDS_LEFT2.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= Hands ========================= */

    /*========================= WEAPONS ========================= */
    GL.bindBuffer(GL.ARRAY_BUFFER, tabungVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tabungColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tabungFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, SABER_MATRIX);

    GL.drawElements(GL.TRIANGLES, tabung.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SABER_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SABER_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SABER_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, SABER_MATRIX);

    GL.drawElements(GL.TRIANGLES, tabung.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, gunVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, gunColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gunFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, SABER_MATRIX);

    GL.drawElements(GL.TRIANGLES, gun.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= WEAPONS ========================= */

    GL.flush();

    window.requestAnimationFrame(animateRobot);
  };

  animateRobot(0);
}

window.addEventListener("load", main);
