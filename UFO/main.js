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

    theta += (dx * 2 * Math.PI) / CANVAS.height; // Update theta based on vertical movement (dy)
    alpha += (dy * 2 * Math.PI) / CANVAS.width; // Update alpha based on horizontal movement (dx)
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
  var kepala1 = generateHalfSphere(0, 2, 0, 1.5, 30, [0, 0.45, 0.64]);

  // Create buffers
  var kepala1_vertex = createVertexBuffer(GL, kepala1.vertices);
  var kepala1_colors = createColorBuffer(GL, kepala1.colors);
  var kepala1_faces = createFacesBuffer(GL, kepala1.faces);

  //bagian pola
  var kepala2 = generateHalfSphere(0, 2.1, 0, 1.53, 30, [0.11, 0.88, 0.94]);

  // Create buffers
  var kepala2_vertex = createVertexBuffer(GL, kepala2.vertices);
  var kepala2_colors = createColorBuffer(GL, kepala2.colors);
  var kepala2_faces = createFacesBuffer(GL, kepala2.faces);

  // ========================== Badan ==================================
  // bagian dalam
  var badan1 = generateSolidTube(0, 0, 0, 1.5, 1.5, 4, 30, [0, 0.45, 0.64]);

  // Create buffers for the first octagon
  var badan1_VERTEX = createVertexBuffer(GL, badan1.vertices);
  var badan1_COLORS = createColorBuffer(GL, badan1.colors);
  var badan1_FACES = createFacesBuffer(GL, badan1.faces);

  // bagian luar
  var badan2 = generateSolidTube(
    0,
    0,
    0,
    1.505,
    1.505,
    4,
    10,
    [0.11, 0.88, 0.94]
  );

  // Create buffers for the first octagon
  var badan2_VERTEX = createVertexBuffer(GL, badan2.vertices);
  var badan2_COLORS = createColorBuffer(GL, badan2.colors);
  var badan2_FACES = createFacesBuffer(GL, badan2.faces);

  // ========================== Tube Backpack ==================================

  // top backpack
  var topBackpack = generateHalfSphere(
    0,
    1.9,
    -2.8,
    0.65,
    30,
    [0.44, 0.44, 0.52]
  );
  // Create buffers
  var topBackpack_vertex = createVertexBuffer(GL, topBackpack.vertices);
  var topBackpack_colors = createColorBuffer(GL, topBackpack.colors);
  var topBackpack_faces = createFacesBuffer(GL, topBackpack.faces);

  // body backpack
  var backpack = generateSolidTube(
    0,
    0.16,
    -2.8,
    0.65,
    0.65,
    3.5,
    30,
    [0.24, 0.25, 0.29]
  );
  // Create buffers
  var backpack_vertex = createVertexBuffer(GL, backpack.vertices);
  var backpack_colors = createColorBuffer(GL, backpack.colors);
  var backpack_faces = createFacesBuffer(GL, backpack.faces);

  // backpack aksesoris 2
  var backpack2 = generateSolidTube(
    0,
    1.46,
    -2.8,
    0.67,
    0.67,
    0.35,
    30,
    [0.09, 1, 0.99]
  );
  // Create buffers
  var backpack2_vertex = createVertexBuffer(GL, backpack2.vertices);
  var backpack2_colors = createColorBuffer(GL, backpack2.colors);
  var backpack2_faces = createFacesBuffer(GL, backpack2.faces);

  // backpack aksesoris 3
  var backpack3 = generateSolidTube(
    0,
    1.1,
    -2.8,
    0.67,
    0.67,
    0.35,
    30,
    [0.17, 0.84, 0.83]
  );
  // Create buffers
  var backpack3_vertex = createVertexBuffer(GL, backpack3.vertices);
  var backpack3_colors = createColorBuffer(GL, backpack3.colors);
  var backpack3_faces = createFacesBuffer(GL, backpack3.faces);

  // backpack aksesoris 4
  var backpack4 = generateSolidTube(
    0,
    0.16,
    -2.8,
    0.67,
    0.67,
    0.35,
    30,
    [0.17, 0.84, 0.83]
  );
  // Create buffers
  var backpack4_vertex = createVertexBuffer(GL, backpack4.vertices);
  var backpack4_colors = createColorBuffer(GL, backpack4.colors);
  var backpack4_faces = createFacesBuffer(GL, backpack4.faces);

  // bottom backpack
  var bottomBackpack = generateHalfSphere(
    0,
    -1.58,
    -2.8,
    -0.65,
    30,
    [0.44, 0.44, 0.52]
  );
  // Create buffers
  var bottomBackpack_vertex = createVertexBuffer(GL, bottomBackpack.vertices);
  var bottomBackpack_colors = createColorBuffer(GL, bottomBackpack.colors);
  var bottomBackpack_faces = createFacesBuffer(GL, bottomBackpack.faces);

  // ========================== UFO ==================================
  // UFO dark grey
  var ufo1 = generateUFO(2.5, 2.5, 1.2, 30, 0, -1.4, 0, [0.44, 0.44, 0.52]);

  // Create buffers
  var ufo1_vertex = createVertexBuffer(GL, ufo1.vertices);
  var ufo1_colors = createColorBuffer(GL, ufo1.colors);
  var ufo1_faces = createFacesBuffer(GL, ufo1.faces);

  // UFO Yellow
  var ufo2 = generateUFO(2.2, 2.2, 1.5, 40, 0, -1.4, 0, [1, 0.85, 0.21]);

  // Create buffers
  var ufo2_vertex = createVertexBuffer(GL, ufo2.vertices);
  var ufo2_colors = createColorBuffer(GL, ufo2.colors);
  var ufo2_faces = createFacesBuffer(GL, ufo2.faces);

  // UFO3
  // bottom UFO
  var botUFO = generateHalfSphere(0, -1, 0, -2.4, 30, [0.24, 0.25, 0.29]);

  // Create buffers
  var botUFO_vertex = createVertexBuffer(GL, botUFO.vertices);
  var botUFO_colors = createColorBuffer(GL, botUFO.colors);
  var botUFO_faces = createFacesBuffer(GL, botUFO.faces);

  // ========================== Weapon ==================================
  var leftWeapon = generateWeapon(-2.65, -1.5, 1, 0.2, 0, 4, 5, [0, 0, 0]);
  // Create buffers
  var leftWeapon_vertex = createVertexBuffer(GL, leftWeapon.vertices);
  var leftWeapon_colors = createColorBuffer(GL, leftWeapon.colors);
  var leftWeapon_faces = createFacesBuffer(GL, leftWeapon.faces);

  var rightWeapon = generateWeapon(2.61, -1.5, 1, 0.2, 0, 4, 5, [0, 0, 0]);
  // Create buffers
  var rightWeapon_vertex = createVertexBuffer(GL, rightWeapon.vertices);
  var rightWeapon_colors = createColorBuffer(GL, rightWeapon.colors);
  var rightWeapon_faces = createFacesBuffer(GL, rightWeapon.faces);

  // ======================== Laser For The Body =========================================
  var leftLaser = generateWeapon(-2.65, -1.5, 2.5, 0.15, -0.1, 1, 5, [1, 0, 0]);
  // Create buffers
  var leftLaser_vertex = createVertexBuffer(GL, leftLaser.vertices);
  var leftLaser_colors = createColorBuffer(GL, leftLaser.colors);
  var leftLaser_faces = createFacesBuffer(GL, leftLaser.faces);

  var rightLaser = generateWeapon(2.61, -1.5, 2.5, 0.15, -0.1, 1, 5, [1, 0, 0]);
  // Create buffers
  var rightLaser_vertex = createVertexBuffer(GL, rightLaser.vertices);
  var rightLaser_colors = createColorBuffer(GL, rightLaser.colors);
  var rightLaser_faces = createFacesBuffer(GL, rightLaser.faces);

  // Laser for shooting
  var leftLaserShoot = generateWeapon(-2.65, -1.5, 2.5, 0.15, -0.1, 1, 5, [1, 0, 0]);
  // Create buffers
  var leftLaserShoot_vertex = createVertexBuffer(GL, leftLaserShoot.vertices);
  var leftLaserShoot_colors = createColorBuffer(GL, leftLaserShoot.colors);
  var leftLaserShoot_faces = createFacesBuffer(GL, leftLaserShoot.faces);

  var rightLaserShoot = generateWeapon(2.61, -1.5, 2.5, 0.15, -0.1, 1, 5, [1, 0, 0]);
  // Create buffers
  var rightLaserShoot_vertex = createVertexBuffer(GL, rightLaserShoot.vertices);
  var rightLaserShoot_colors = createColorBuffer(GL, rightLaserShoot.colors);
  var rightLaserShoot_faces = createFacesBuffer(GL, rightLaserShoot.faces);

  //matrix
  var PROJECTION_MATRIX = LIBS.get_projection(
    40,
    CANVAS.width / CANVAS.height,
    1,
    100
  );
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();

  //Body
  var BODY_MATRIX = LIBS.get_I4();

  var LASER_MATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEW_MATRIX, -30);
  LIBS.rotateY(VIEW_MATRIX, 5)


  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var BodyTime = 0;
  var BodyReverse = false;

  var LaserTime = 0;
  var isMovingForward = true;
  var animationDuration = 27; //Cepat lambatnya laser
  var startLaserTime = 0;
  var endLaserTime = animationDuration;
  var startProgress = 0;
  var finishProgress = 1;
  var targetProgress = finishProgress;


  var time_prev = 0;

  var animate = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    time *= 0.0004;

    var deltaTime = (time - time_prev) * 100;
    time_prev = time;

    if (!drag) {
      dx *= friction;
      dy *= friction;

      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }

    // Body
    BODY_MATRIX = LIBS.get_I4();

    var KF_Body = 0;

    if (time < 10) {
      if (BodyTime <= -10) {
        BodyReverse = true;
      } else if (BodyTime >= 10) {
        BodyReverse = false;
      }

      if (BodyReverse) {
        BodyTime += deltaTime;
      } else {
        BodyTime -= deltaTime;
      }

      KF_Body = LIBS.degToRad(BodyTime);
      KF_Body *= 2.5;
    }

    LIBS.translateY(BODY_MATRIX, KF_Body);
    LIBS.rotateY(BODY_MATRIX, theta);
    //LIBS.rotateX(BODY_MATRIX, alpha);


    //===================== LASER =============
    LASER_MATRIX = LIBS.get_I4();

    var KF_Laser = 0;
  
    if (time < 60) {
      if (isMovingForward && LaserTime >= endLaserTime) {
        // If moving forward and reached the finish point, reset to start point
        startLaserTime = 0;
        LaserTime = startLaserTime;
        targetProgress = finishProgress; // Set target progress for next movement
      } else if (!isMovingForward && LaserTime <= startLaserTime) {
        // If moving backward and reached the start point, reset to start point
        LaserTime = startLaserTime;
        targetProgress = finishProgress; // Set target progress for next movement
      }
    
      // Calculate movement based on direction
      if (isMovingForward) {
        LaserTime += deltaTime;
      } else {
        LaserTime -= deltaTime;
      }
    
      // Calculate current progress based on LaserTime
      var progress = (LaserTime - startLaserTime) / (endLaserTime - startLaserTime);
      
      // Smoothly interpolate between start and finish progress
      var currentProgress = startProgress + (targetProgress - startProgress) * progress;
    
      KF_Laser = currentProgress * 10; //dikali berapa untuk jarak laser
    }

    //LIBS.translateX(LASER_MATRIX, KF_Laser)
    //LIBS.translateY(LASER_MATRIX, KF_Laser);
    LIBS.translateZ(LASER_MATRIX, KF_Laser);
    
    LIBS.rotateY(LASER_MATRIX, theta);
    //LIBS.rotateX(LASER_MATRIX, alpha);

    if (time = 1) {
        LIBS.translateZ(BODY_MATRIX, 4)
        LIBS.rotateY(VIEW_MATRIX, 0.06)
    }


    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateY(MODEL_MATRIX, theta);
    //LIBS.rotateX(MODEL_MATRIX, alpha);

    // kepala1
    GL.bindBuffer(GL.ARRAY_BUFFER, kepala1_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepala1_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepala1_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLES, kepala2.faces.length, GL.UNSIGNED_SHORT, 0);

    // badan 1
    GL.bindBuffer(GL.ARRAY_BUFFER, badan1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, badan1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, badan1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, ufo1.faces.length, GL.UNSIGNED_SHORT, 0);

    //gambar ufo2
    GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ufo2_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, ufo2.faces.length, GL.UNSIGNED_SHORT, 0);

    //Bot UFO
    GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, botUFO_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      topBackpack.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Draw backpack body
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

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
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      bottomBackpack.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Gambar LeftWeapon
    GL.bindBuffer(GL.ARRAY_BUFFER, leftWeapon_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, leftWeapon_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftWeapon_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      leftWeapon.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Gambar RightWeapon
    GL.bindBuffer(GL.ARRAY_BUFFER, rightWeapon_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, rightWeapon_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightWeapon_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      rightWeapon.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    //
    // LASER untuk badan
    // Gambar left laser
    GL.bindBuffer(GL.ARRAY_BUFFER, leftLaser_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, leftLaser_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLaser_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      leftLaser.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Gambar right laser
    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaser_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaser_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaser_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      rightLaser.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    //Laser untuk menembak
    // Gambar left laser
    GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLaserShoot_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, LASER_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      leftLaserShoot.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    // Gambar right laser
    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaserShoot_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, LASER_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      rightLaserShoot.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener("load", main);
