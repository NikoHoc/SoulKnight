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

  var mouseDown = function (e) {
    drag = true;
    x_prev = e.pageX;
    y_prev = e.pageY;
  };
  var mouseUP = function (e) {
    drag = false;
  };
  var mouseOut = function (e) {};
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

  /*========================================================= */
  /*========================= UFO ========================= */
  /*========================================================= */

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
  var leftLaserShoot = generateWeapon(
    -2.65,
    -1.5,
    2.5,
    0.15,
    -0.1,
    1,
    5,
    [1, 0, 0]
  );
  // Create buffers
  var leftLaserShoot_vertex = createVertexBuffer(GL, leftLaserShoot.vertices);
  var leftLaserShoot_colors = createColorBuffer(GL, leftLaserShoot.colors);
  var leftLaserShoot_faces = createFacesBuffer(GL, leftLaserShoot.faces);

  var rightLaserShoot = generateWeapon(
    2.61,
    -1.5,
    2.5,
    0.15,
    -0.1,
    1,
    5,
    [1, 0, 0]
  );
  // Create buffers
  var rightLaserShoot_vertex = createVertexBuffer(GL, rightLaserShoot.vertices);
  var rightLaserShoot_colors = createColorBuffer(GL, rightLaserShoot.colors);
  var rightLaserShoot_faces = createFacesBuffer(GL, rightLaserShoot.faces);

  //
  // KECILIN UFO
  //
  var scaleFactor = 0.04;
  var childUFO = [
    kepala1, kepala2,
    badan1, badan2,
    topBackpack, backpack, backpack2, backpack3, backpack4, bottomBackpack,
    ufo1, ufo2, botUFO,
    leftWeapon, rightWeapon,
    leftLaser, rightLaser,
    leftLaserShoot, rightLaserShoot
  ];

  for (var i = 0; i < childUFO.length; i++) {
    childUFO[i].vertices = childUFO[i].vertices.map(
      (coord) => coord * scaleFactor
    );
  }

  //
  // GESER-GESER UFO
  //
  var geserX = 0;
  var geserY = 0.5;
  var geserZ = 4;

  for (var i = 0; i < childUFO.length; i++) {
    for (var j = 0; j < childUFO[i].vertices.length; j += 3) {
      childUFO[i].vertices[j] += geserX;
    }
    for (var j = 1; j < childUFO[i].vertices.length; j += 3) {
      childUFO[i].vertices[j] += geserY;
    }
    for (var j = 2; j < childUFO[i].vertices.length; j += 3) {
      childUFO[i].vertices[j] += geserZ;
    }
  }

  /*========================================================= */
  /*======================== END UFO ====================== */
  /*========================================================= */

  /*========================================================= */
  /*====================== ENVIROMENT ======================= */
  /*========================================================= */

  //Floor
  var floor = generateWorld(50, 50, 0.3, 0, 0, 0, [0.33, 0.44, 0.48]);

  var FLOOR_VERTEX = createVertexBuffer(GL, floor.vertices);
  var FLOOR_COLORS = createColorBuffer(GL, floor.colors);
  var FLOOR_FACES = createFacesBuffer(GL, floor.faces);

  //Back
  var backWall = generateWorld(50, 0.3, 7, 0, 3.2, -22, [0.52, 0.77, 0.86]);

  var BACK_WALL_VERTEX = createVertexBuffer(GL, backWall.vertices);
  var BACK_WALL_COLORS = createColorBuffer(GL, backWall.colors);
  var BACK_WALL_FACES = createFacesBuffer(GL, backWall.faces);

  //Left
  var leftWall = generateWorld(50, 0.3, 7, -5, 3, -1, [0.52, 0.77, 0.86]);

  var LEFT_WALL_VERTEX = createVertexBuffer(GL, leftWall.vertices);
  var LEFT_WALL_COLORS = createColorBuffer(GL, leftWall.colors);
  var LEFT_WALL_FACES = createFacesBuffer(GL, leftWall.faces);

  //Right
  var rightWall = generateWorld(50, 0.3, 7, 5, 3.05, -1, [0.52, 0.77, 0.86]);

  var RIGHT_WALL_VERTEX = createVertexBuffer(GL, rightWall.vertices);
  var RIGHT_WALL_COLORS = createColorBuffer(GL, rightWall.colors);
  var RIGHT_WALL_FACES = createFacesBuffer(GL, rightWall.faces);

  //Obstacle
  var wall1 = generateCube(5, 2, 10, 6, 3, 4, [0.14, 0.16, 0.17]);

  var WALL1_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, WALL1_VERTEX);
  GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array(wall1.vertices),
    GL.STATIC_DRAW
  );

  var WALL1_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, WALL1_COLORS);
  GL.bufferData(
    GL.ARRAY_BUFFER,
    new Float32Array(wall1.colors),
    GL.STATIC_DRAW
  );

  var WALL1_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, WALL1_FACES);
  GL.bufferData(
    GL.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(wall1.faces),
    GL.STATIC_DRAW
  );

  /*========================================================= */
  /*========================= MATRIX ======================== */
  /*========================================================= */
  var PROJECTION_MATRIX = LIBS.get_projection(
    40,
    CANVAS.width / CANVAS.height,
    1,
    100
  );
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();

  /*========================= MATRIX UFO ======================== */
  var BODY_MATRIX = LIBS.get_I4();

  var LASER_MATRIX = LIBS.get_I4();

  var UFO_VIEW_MATRIX = LIBS.get_I4();

  //First Render of the UFO
  LIBS.translateX(UFO_VIEW_MATRIX, -21);
  LIBS.translateY(UFO_VIEW_MATRIX, -4.5);
  LIBS.translateZ(UFO_VIEW_MATRIX, -80);

  LIBS.rotateY(UFO_VIEW_MATRIX, 20);

  /*========================= MATRIX ENV ========================= */
  // Floor
  var WORLD_MATRIX = LIBS.get_I4();
  var WALL1_MATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEW_MATRIX, -60);
  LIBS.translateY(VIEW_MATRIX, -10);

  //Left Wall
  var LEFT_WALL_VIEW_MATRIX = LIBS.get_I4();
  LIBS.translateZ(LEFT_WALL_VIEW_MATRIX, -56.1);
  LIBS.translateY(LEFT_WALL_VIEW_MATRIX, -10);
  LIBS.translateX(LEFT_WALL_VIEW_MATRIX, -27);

  LIBS.rotateX(LEFT_WALL_VIEW_MATRIX, 6.3);
  LIBS.rotateY(LEFT_WALL_VIEW_MATRIX, -7.85);
  //LIBS.rotateZ(LEFT_WALL_VIEW_MATRIX, 0);

  //Right Wall
  var RIGHT_WALL_VIEW_MATRIX = LIBS.get_I4();
  LIBS.translateZ(RIGHT_WALL_VIEW_MATRIX, -56.1);
  LIBS.translateY(RIGHT_WALL_VIEW_MATRIX, -10);
  LIBS.translateX(RIGHT_WALL_VIEW_MATRIX, 27);

  LIBS.rotateX(RIGHT_WALL_VIEW_MATRIX, -6.3);
  LIBS.rotateY(RIGHT_WALL_VIEW_MATRIX, 7.85);
  // LIBS.rotateZ(RIGHT_WALL_VIEW_MATRIX, 10);

  /*=========================================================== */
  /*========================= DRAWING ========================= */
  /*=========================================================== */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  // FOR  UFO
  var UFOBodyTime = 0;
  var UFOBodyReverse = false;

  var LaserTime = 0;
  var isMovingForward = true;
  var animationDuration = 27; //Cepat lambatnya laser
  var startLaserTime = 0;
  var endLaserTime = animationDuration;
  var startProgress = 0;
  var finishProgress = 1;
  var targetProgress = finishProgress;

  var time_prev = 0;

  /*=========================================================== */
  /*========================= ANIMATE ========================= */
  /*=========================================================== */
  var animateRobot = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    time *= 0.0004;

    var deltaTime = (time - time_prev) * 100;
    time_prev = time;

    /*========================= UFO TIME AND ANIMATION ========================= */
    // Body
    BODY_MATRIX = LIBS.get_I4();

    var KF_UFO_Body = 0;

    if (time < 40) {
      if (UFOBodyTime <= -10) {
        UFOBodyReverse = true;
      } else if (UFOBodyTime >= 10) {
        UFOBodyReverse = false;
      }

      if (UFOBodyReverse) {
        UFOBodyTime += deltaTime;
      } else {
        UFOBodyTime -= deltaTime;
      }

      KF_UFO_Body = LIBS.degToRad(UFOBodyTime);
      KF_UFO_Body *= 2.5;
    }

    LIBS.translateY(BODY_MATRIX, KF_UFO_Body);
    LIBS.rotateY(BODY_MATRIX, theta);
    //LIBS.rotateX(BODY_MATRIX, alpha);

    //===================== LASER ANIMATION =============
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
      var progress =
        (LaserTime - startLaserTime) / (endLaserTime - startLaserTime);

      // Smoothly interpolate between start and finish progress
      var currentProgress =
        startProgress + (targetProgress - startProgress) * progress;

      KF_Laser = currentProgress * 10; //dikali berapa untuk jarak laser
    }

    //LIBS.translateX(LASER_MATRIX, KF_Laser)
    //LIBS.translateY(LASER_MATRIX, KF_Laser);
    LIBS.translateZ(LASER_MATRIX, KF_Laser);

    //LIBS.rotateY(LASER_MATRIX, theta);
    //LIBS.rotateX(LASER_MATRIX, alpha);

    /*========================= UFO TIME AND ANIMATION  ========================= */

    /*========================= WORLD ANIMASI ========================= */
    WORLD_MATRIX = LIBS.get_I4();
    //LIBS.rotateY(WORLD_MATRIX, theta);

    WALL1_MATRIX = LIBS.get_I4();
    //LIBS.rotateY(WALL1_MATRIX, theta);
    /*========================= WORLD ANIMASI ========================= */

    // MODEL_MATRIX = LIBS.get_I4();

    /*================================================================= */
    /*=========================== ufo DRAW ========================== */
    /*================================================================= */

    // kepala1
    GL.bindBuffer(GL.ARRAY_BUFFER, kepala1_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepala1_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepala1_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLES, kepala2.faces.length, GL.UNSIGNED_SHORT, 0);

    // badan 1
    GL.bindBuffer(GL.ARRAY_BUFFER, badan1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, badan1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, badan1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, ufo1.faces.length, GL.UNSIGNED_SHORT, 0);

    //gambar ufo2
    GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ufo2_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, ufo2.faces.length, GL.UNSIGNED_SHORT, 0);

    //Bot UFO
    GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, botUFO_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, LASER_MATRIX);

    GL.drawElements(
      GL.TRIANGLE_STRIP,
      rightLaserShoot.faces.length,
      GL.UNSIGNED_SHORT,
      0
    );

    /*================================================================= */
    /*=========================== WORLD DRAW ========================== */
    /*================================================================= */
    // Floor
    GL.bindBuffer(GL.ARRAY_BUFFER, FLOOR_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, FLOOR_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FLOOR_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);

    GL.drawElements(GL.TRIANGLES, floor.faces.length, GL.UNSIGNED_SHORT, 0);

    // BACK Wall
    GL.bindBuffer(GL.ARRAY_BUFFER, BACK_WALL_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BACK_WALL_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BACK_WALL_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);

    GL.drawElements(GL.TRIANGLES, backWall.faces.length, GL.UNSIGNED_SHORT, 0);

    // LEFT Wall
    GL.bindBuffer(GL.ARRAY_BUFFER, LEFT_WALL_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, LEFT_WALL_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEFT_WALL_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, LEFT_WALL_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);

    GL.drawElements(GL.TRIANGLES, leftWall.faces.length, GL.UNSIGNED_SHORT, 0);

    // RIGHT Wall
    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHT_WALL_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, RIGHT_WALL_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RIGHT_WALL_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, RIGHT_WALL_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);

    GL.drawElements(GL.TRIANGLES, rightWall.faces.length, GL.UNSIGNED_SHORT, 0);

    //Obstacle
    GL.bindBuffer(GL.ARRAY_BUFFER, WALL1_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, WALL1_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, WALL1_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, WALL1_MATRIX);

    GL.drawElements(GL.TRIANGLES, wall1.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.flush();

    window.requestAnimationFrame(animateRobot);
  };

  animateRobot(0);
}

window.addEventListener("load", main);
