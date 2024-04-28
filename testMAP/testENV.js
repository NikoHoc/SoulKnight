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
  var badan2 = generateSolidTube(0, 0, 0, 1.505, 1.505, 4, 10, [0.11, 0.88, 0.94]);

  // Create buffers for the first octagon
  var badan2_VERTEX = createVertexBuffer(GL, badan2.vertices);
  var badan2_COLORS = createColorBuffer(GL, badan2.colors);
  var badan2_FACES = createFacesBuffer(GL, badan2.faces);

  // ========================== Tube Backpack ==================================

  // top backpack
  var topBackpack = generateHalfSphere(0, 1.9, -2.8, 0.65, 30, [0.44, 0.44, 0.52]);
  // Create buffers
  var topBackpack_vertex = createVertexBuffer(GL, topBackpack.vertices);
  var topBackpack_colors = createColorBuffer(GL, topBackpack.colors);
  var topBackpack_faces = createFacesBuffer(GL, topBackpack.faces);

  // body backpack
  var backpack = generateSolidTube(0, 0.16, -2.8, 0.65, 0.65, 3.5, 30, [0.24, 0.25, 0.29]);
  // Create buffers
  var backpack_vertex = createVertexBuffer(GL, backpack.vertices);
  var backpack_colors = createColorBuffer(GL, backpack.colors);
  var backpack_faces = createFacesBuffer(GL, backpack.faces);

  // backpack aksesoris 2
  var backpack2 = generateSolidTube(0, 1.46, -2.8, 0.67, 0.67, 0.35, 30, [0.09, 1, 0.99]);
  // Create buffers
  var backpack2_vertex = createVertexBuffer(GL, backpack2.vertices);
  var backpack2_colors = createColorBuffer(GL, backpack2.colors);
  var backpack2_faces = createFacesBuffer(GL, backpack2.faces);

  // backpack aksesoris 3
  var backpack3 = generateSolidTube(0, 1.1, -2.8, 0.67, 0.67, 0.35, 30, [0.17, 0.84, 0.83]);
  // Create buffers
  var backpack3_vertex = createVertexBuffer(GL, backpack3.vertices);
  var backpack3_colors = createColorBuffer(GL, backpack3.colors);
  var backpack3_faces = createFacesBuffer(GL, backpack3.faces);

  // backpack aksesoris 4
  var backpack4 = generateSolidTube(0, 0.16, -2.8, 0.67, 0.67, 0.35, 30, [0.17, 0.84, 0.83]);
  // Create buffers
  var backpack4_vertex = createVertexBuffer(GL, backpack4.vertices);
  var backpack4_colors = createColorBuffer(GL, backpack4.colors);
  var backpack4_faces = createFacesBuffer(GL, backpack4.faces);

  // bottom backpack
  var bottomBackpack = generateHalfSphere(0, -1.58, -2.8, -0.65, 30, [0.44, 0.44, 0.52]);
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

  /*========================================================= */
  /*======================== END UFO ====================== */
  /*========================================================= */

  /*========================================================= */
  /*========================= ROBOT ========================= */
  /*========================================================= */

  /*========================= HEAD ========================= */
  var kepalaATAS = generateSolidOctagon(0, 0.85, 0, 2, 1, 1.3, 8, [172 / 256, 189 / 256, 190 / 256]);

  var kepalaATAS_VERTEX = createVertexBuffer(GL, kepalaATAS.vertices);
  var kepalaATAS_COLORS = createColorBuffer(GL, kepalaATAS.colors);
  var kepalaATAS_FACES = createFacesBuffer(GL, kepalaATAS.faces);

  var kepalaTENGAH = generateSolidOctagon(0, -0.15, 0, 1, 1.6, 0.7, 8, [0, 0, 0]);

  var kepalaTENGAH_VERTEX = createVertexBuffer(GL, kepalaTENGAH.vertices);
  var kepalaTENGAH_COLORS = createColorBuffer(GL, kepalaTENGAH.colors);
  var kepalaTENGAH_FACES = createFacesBuffer(GL, kepalaTENGAH.faces);

  var kepalaBAWAH = generateSolidOctagon(0, -1, 0, 2, 1, 1, 8, [172 / 256, 189 / 256, 190 / 256]);

  var kepalaBAWAH_VERTEX = createVertexBuffer(GL, kepalaBAWAH.vertices);
  var kepalaBAWAH_COLORS = createColorBuffer(GL, kepalaBAWAH.colors);
  var kepalaBAWAH_FACES = createFacesBuffer(GL, kepalaBAWAH.faces);

  /*========================= MATA ========================= */
  var MATA = generateSphere(0, -0.15, 1.82, 0.4, 16);

  var MATA_VERTEX = createVertexBuffer(GL, MATA.vertices);
  var MATA_COLORS = createColorBuffer(GL, MATA.colors);
  var MATA_FACES = createFacesBuffer(GL, MATA.faces);

  /*========================= BODY ========================= */
  var MAIN_BODY = generateCube(0, -3.27, 0, 3.95, 3.5, 2, [100 / 256, 140 / 256, 139 / 256]);

  var MAIN_BODY_VERTEX = createVertexBuffer(GL, MAIN_BODY.vertices);
  var MAIN_BODY_COLORS = createColorBuffer(GL, MAIN_BODY.colors);
  var MAIN_BODY_FACES = createFacesBuffer(GL, MAIN_BODY.faces);

  var BOTTOM_BODY = generateCube(0, -5.2, 0, 1.7, 0.5, 2, [100 / 256, 140 / 256, 139 / 256]);

  var BOTTOM_BODY_VERTEX = createVertexBuffer(GL, BOTTOM_BODY.vertices);
  var BOTTOM_BODY_COLORS = createColorBuffer(GL, BOTTOM_BODY.colors);
  var BOTTOM_BODY_FACES = createFacesBuffer(GL, BOTTOM_BODY.faces);

  /*========================= Armor Plate ========================= */
  var ARMOR = generateCube(0, -3.15, 1.2, 3.5, 2.7, 0.7, [172 / 256, 189 / 256, 190 / 256]);

  var ARMOR_VERTEX = createVertexBuffer(GL, ARMOR.vertices);
  var ARMOR_COLORS = createColorBuffer(GL, ARMOR.colors);
  var ARMOR_FACES = createFacesBuffer(GL, ARMOR_FACES);

  /*========================= Shoulder ========================= */
  var shoulderDataRight = generateShoulder(1.95, -3, 0, 1.3, 1, 1.4, 50, true, [172 / 256, 189 / 256, 190 / 256]);

  var SHOULDER_VERTEX_RIGHT = createVertexBuffer(GL, shoulderDataRight.vertices);
  var SHOULDER_COLORS_RIGHT = createColorBuffer(GL, shoulderDataRight.colors);
  var SHOULDER_FACES_RIGHT = createFacesBuffer(GL, shoulderDataRight.faces);

  var shoulderDataLeft = generateShoulder(-1.95, -3, 0, 1.3, 1, 1.4, 50, false, [172 / 256, 189 / 256, 190 / 256]);

  var SHOULDER_VERTEX_LEFT = createVertexBuffer(GL, shoulderDataLeft.vertices);
  var SHOULDER_COLORS_LEFT = createColorBuffer(GL, shoulderDataLeft.colors);
  var SHOULDER_FACES_LEFT = createFacesBuffer(GL, shoulderDataLeft.faces);

  /*========================= Hands ========================= */
  var HANDS_RIGHT = generateCube(2.6, -3.55, 0.1, 0.8, 2.2, 0.67, [66 / 256, 94 / 256, 96 / 256]);

  var HANDS_RIGHT_VERTEX = createVertexBuffer(GL, HANDS_RIGHT.vertices);
  var HANDS_RIGHT_COLORS = createColorBuffer(GL, HANDS_RIGHT.colors);
  var HANDS_RIGHT_FACES = createFacesBuffer(GL, HANDS_RIGHT.faces);

  var HANDS_LEFT = generateCube(-2.6, -3.25, 0.1, 0.8, 1, 0.67, [66 / 256, 94 / 256, 96 / 256]);

  var HANDS_LEFT_VERTEX = createVertexBuffer(GL, HANDS_LEFT.vertices);
  var HANDS_LEFT_COLORS = createColorBuffer(GL, HANDS_LEFT.colors);
  var HANDS_LEFT_FACES = createFacesBuffer(GL, HANDS_LEFT.faces);

  var HANDS_LEFT2 = generateCube(-2.6, -3.5, 1.2, 0.8, 0.5, 1.7, [66 / 256, 94 / 256, 96 / 256]);

  var HANDS_LEFT_VERTEX2 = createVertexBuffer(GL, HANDS_LEFT2.vertices);
  var HANDS_LEFT_COLORS2 = createColorBuffer(GL, HANDS_LEFT2.colors);
  var HANDS_LEFT_FACES2 = createFacesBuffer(GL, HANDS_LEFT2.faces);

  /*========================= Legs ========================= */
  var PAHA_RIGHT = generateCube(1.37, -5.71, 0.15, 1, 1.35, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  var PAHA_RIGHT_VERTEX = createVertexBuffer(GL, PAHA_RIGHT.vertices);
  var PAHA_RIGHT_COLORS = createColorBuffer(GL, PAHA_RIGHT.colors);
  var PAHA_RIGHT_FACES = createFacesBuffer(GL, PAHA_RIGHT.faces);

  var PAHA_LEFT = generateCube(-1.37, -5.71, 0.15, 1, 1.35, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  var PAHA_LEFT_VERTEX = createVertexBuffer(GL, PAHA_LEFT.vertices);
  var PAHA_LEFT_COLORS = createColorBuffer(GL, PAHA_LEFT.colors);
  var PAHA_LEFT_FACES = createFacesBuffer(GL, PAHA_LEFT.faces);

  var KAKI_RIGHT = generateCube(1.37, -7, 0.15, 0.8, 1.35, 0.8, [100 / 256, 140 / 256, 139 / 256]);

  var KAKI_RIGHT_VERTEX = createVertexBuffer(GL, KAKI_RIGHT.vertices);
  var KAKI_RIGHT_COLORS = createColorBuffer(GL, KAKI_RIGHT.colors);
  var KAKI_RIGHT_FACES = createFacesBuffer(GL, KAKI_RIGHT.faces);

  var KAKI_LEFT = generateCube(-1.37, -7, 0.15, 0.8, 1.35, 0.8, [100 / 256, 140 / 256, 139 / 256]);

  var KAKI_LEFT_VERTEX = createVertexBuffer(GL, KAKI_LEFT.vertices);
  var KAKI_LEFT_COLORS = createColorBuffer(GL, KAKI_LEFT.colors);
  var KAKI_LEFT_FACES = createFacesBuffer(GL, KAKI_LEFT.faces);

  var TELAPAK_RIGHT = generateCube(1.37, -7.9, 0.3, 1, 0.5, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  var TELAPAK_RIGHT_VERTEX = createVertexBuffer(GL, TELAPAK_RIGHT.vertices);
  var TELAPAK_RIGHT_COLORS = createColorBuffer(GL, TELAPAK_RIGHT.colors);
  var TELAPAK_RIGHT_FACES = createFacesBuffer(GL, TELAPAK_RIGHT.faces);

  var TELAPAK_LEFT = generateCube(-1.37, -7.9, 0.3, 1, 0.5, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  var TELAPAK_LEFT_VERTEX = createVertexBuffer(GL, TELAPAK_LEFT.vertices);
  var TELAPAK_LEFT_COLORS = createColorBuffer(GL, TELAPAK_LEFT.colors);
  var TELAPAK_LEFT_FACES = createFacesBuffer(GL, TELAPAK_LEFT.faces);

  /*========================= WEAPON ========================= */
  var tabung = generateTabung(-2.59, -3.5, 1.8, 0.1, 0.4, 1.3, 100, [90 / 256, 130 / 256, 143 / 256]);

  var tabungVertex = createVertexBuffer(GL, tabung.vertices);
  var tabungColors = createColorBuffer(GL, tabung.colors);
  var tabungFaces = createFacesBuffer(GL, tabung.faces);

  var SABER = generateTabung(-2.59, -0.5, 1.8, 0.1, 0.3, 5, 100, [1.0, 0.0, 0]);

  var SABER_VERTEX = createVertexBuffer(GL, SABER.vertices);
  var SABER_COLORS = createColorBuffer(GL, SABER.colors);
  var SABER_FACES = createFacesBuffer(GL, SABER.faces);

  var gun = generateSphere(-2.59, 2, 1.8, 0.3, 16);

  var gunVertex = createVertexBuffer(GL, gun.vertices);
  var gunColors = createColorBuffer(GL, gun.colors);
  var gunFaces = createFacesBuffer(GL, gun.faces);

  /*========================================================= */
  /*======================== END ROBOT ====================== */
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
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(wall1.vertices), GL.STATIC_DRAW);

  var WALL1_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, WALL1_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(wall1.colors), GL.STATIC_DRAW);

  var WALL1_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, WALL1_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(wall1.faces), GL.STATIC_DRAW);

  /*========================================================= */
  /*========================= MATRIX ======================== */
  /*========================================================= */
  var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
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

  /*========================= MATRIX ROBOT ========================= */
  var BADAN_MATRIX = LIBS.get_I4();

  var KAKI_KANAN_MATRIX = LIBS.get_I4();

  var KAKI_KIRI_MATRIX = LIBS.get_I4();

  var SABER_MATRIX = LIBS.get_I4();

  var ROBOT_VIEW_MATRIX = LIBS.get_I4();

  //First Render of the ROBOT
  LIBS.translateX(ROBOT_VIEW_MATRIX, 12);
  LIBS.translateY(ROBOT_VIEW_MATRIX, -2);
  LIBS.translateZ(ROBOT_VIEW_MATRIX, -50);

  LIBS.rotateY(ROBOT_VIEW_MATRIX, 0);

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

  // FOR ROBOT
  var then = 0;

  var KakiKananTime = 0;
  var KakiKananReverse = false;

  var KakiKiriTime = 0;
  var KakiKiriReverse = false;

  var SaberTime = 0;
  var SaberReverse = false;

  /*=========================================================== */
  /*========================= ANIMATE ========================= */
  /*=========================================================== */
  var animate = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    time *= 0.0004;

    var deltaTime = (time - time_prev) * 100;
    time_prev = time;
    then = time;

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
      var progress = (LaserTime - startLaserTime) / (endLaserTime - startLaserTime);

      // Smoothly interpolate between start and finish progress
      var currentProgress = startProgress + (targetProgress - startProgress) * progress;

      KF_Laser = currentProgress * 10; //dikali berapa untuk jarak laser
    }

    //LIBS.translateX(LASER_MATRIX, KF_Laser)
    //LIBS.translateY(LASER_MATRIX, KF_Laser);
    LIBS.translateZ(LASER_MATRIX, KF_Laser);

    //LIBS.rotateY(LASER_MATRIX, theta);
    //LIBS.rotateX(LASER_MATRIX, alpha);

    /*========================= UFO TIME AND ANIMATION  ========================= */

    /*========================= ROBOT TIME AND ANIMATION  ========================= */
    // Badan
    BADAN_MATRIX = LIBS.get_I4();

    // Kaki Kanan
    KAKI_KANAN_MATRIX = LIBS.get_I4();
    var KF_KakiKanan = 0;

    if (time < 40) {
      if (KakiKananTime <= -10) {
        KakiKananReverse = true;
      } else if (KakiKananTime >= 10) {
        KakiKananReverse = false;
      }

      if (KakiKananReverse) {
        KakiKananTime += deltaTime;
      } else {
        KakiKananTime -= deltaTime;
      }

      KF_KakiKanan = LIBS.degToRad(KakiKananTime);
    }

    // Kaki Kiri
    KAKI_KIRI_MATRIX = LIBS.get_I4();
    var KF_KakiKiri = 0;

    if (time < 40) {
      if (KakiKiriTime <= -10) {
        KakiKiriReverse = false;
      } else if (KakiKiriTime >= 10) {
        KakiKiriReverse = true;
      }

      if (KakiKiriReverse) {
        KakiKiriTime -= deltaTime;
      } else {
        KakiKiriTime += deltaTime;
      }

      KF_KakiKiri = LIBS.degToRad(KakiKiriTime);
    }

    SABER_MATRIX = LIBS.get_I4();
    var KF_Saber = 0;

    if (time < 40) {
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

    // MODEL_MATRIX = LIBS.get_I4();

    /*========================= ANIMASI ========================= */
    // LIBS.rotateY(MODEL_MATRIX, theta);
    // LIBS.rotateX(MODEL_MATRIX, alpha);

    // BADAN
    LIBS.rotateY(BADAN_MATRIX, theta);
    LIBS.rotateX(BADAN_MATRIX, alpha);

    // KAKI KANAN
    LIBS.rotateX(KAKI_KANAN_MATRIX, KF_KakiKanan);
    LIBS.rotateY(KAKI_KANAN_MATRIX, theta);
    LIBS.rotateX(KAKI_KANAN_MATRIX, alpha);

    // KAKI KIRI
    LIBS.rotateX(KAKI_KIRI_MATRIX, KF_KakiKiri);
    LIBS.rotateY(KAKI_KIRI_MATRIX, theta);
    LIBS.rotateX(KAKI_KIRI_MATRIX, alpha);

    // SABER
    LIBS.rotateX(SABER_MATRIX, KF_Saber);
    LIBS.rotateY(SABER_MATRIX, theta);
    LIBS.rotateX(SABER_MATRIX, alpha);
    /*========================= ROBOT TIME AND ANIMATION  ========================= */

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

    GL.drawElements(GL.TRIANGLE_STRIP, kepala1.faces.length, GL.UNSIGNED_SHORT, 0);

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

    GL.drawElements(GL.TRIANGLE_STRIP, badan1.faces.length, GL.UNSIGNED_SHORT, 0);

    // badan 2
    GL.bindBuffer(GL.ARRAY_BUFFER, badan2_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, badan2_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, badan2_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, badan2.faces.length, GL.UNSIGNED_SHORT, 0);

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

    GL.drawElements(GL.TRIANGLE_STRIP, botUFO.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw bagian top backpack
    GL.bindBuffer(GL.ARRAY_BUFFER, topBackpack_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, topBackpack_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, topBackpack_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, topBackpack.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw backpack body
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, backpack.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw aksesoris backpack 2
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack2_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack2_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack2_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, backpack2.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw aksesoris backpack 3
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack3_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack3_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack3_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, backpack3.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw aksesoris backpack 4
    GL.bindBuffer(GL.ARRAY_BUFFER, backpack4_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, backpack4_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack4_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, backpack4.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw bagian bottom backpack
    GL.bindBuffer(GL.ARRAY_BUFFER, bottomBackpack_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, bottomBackpack_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bottomBackpack_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, bottomBackpack.faces.length, GL.UNSIGNED_SHORT, 0);

    // Gambar LeftWeapon
    GL.bindBuffer(GL.ARRAY_BUFFER, leftWeapon_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, leftWeapon_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftWeapon_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, leftWeapon.faces.length, GL.UNSIGNED_SHORT, 0);

    // Gambar RightWeapon
    GL.bindBuffer(GL.ARRAY_BUFFER, rightWeapon_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, rightWeapon_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightWeapon_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, rightWeapon.faces.length, GL.UNSIGNED_SHORT, 0);

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

    GL.drawElements(GL.TRIANGLE_STRIP, leftLaser.faces.length, GL.UNSIGNED_SHORT, 0);

    // Gambar right laser
    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaser_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaser_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaser_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BODY_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, rightLaser.faces.length, GL.UNSIGNED_SHORT, 0);

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

    GL.drawElements(GL.TRIANGLE_STRIP, leftLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);

    // Gambar right laser
    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_vertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_colors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaserShoot_faces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, LASER_MATRIX);

    GL.drawElements(GL.TRIANGLE_STRIP, rightLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);

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

    // ======================================

    /*================================================================= */
    /*=========================== DRAW ROBOT ========================== */
    /*================================================================= */

     /*========================= HEAD ========================= */
    // Draw first octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaATAS_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaATAS_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaATAS_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, kepalaATAS.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw second octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaTENGAH_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaTENGAH_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaTENGAH_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, kepalaTENGAH.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw third octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaBAWAH_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaBAWAH_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaBAWAH_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, kepalaBAWAH.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= HEAD ========================= */

    /*========================= MATA ========================= */
    // Draw sphere
    GL.bindBuffer(GL.ARRAY_BUFFER, MATA_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, MATA_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, MATA.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= MATA ========================= */

    /*========================= BODY ========================= */
    // Draw cube
    GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MAIN_BODY_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, MAIN_BODY.faces.length, GL.UNSIGNED_SHORT, 0);

    // Bottom
    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BODY_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BODY_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_BODY_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, BOTTOM_BODY.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= BODY ========================= */

    /*========================= Armor Plate ========================= */
    // Draw Squircle
    GL.bindBuffer(GL.ARRAY_BUFFER, ARMOR_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, ARMOR_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ARMOR_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, ARMOR.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= Armor Plate ========================= */

    /*========================= SHOULDERS ========================= */
    // Draw right shoulder
    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_VERTEX_RIGHT);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_COLORS_RIGHT);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SHOULDER_FACES_RIGHT);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, shoulderDataRight.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw left shoulder
    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_VERTEX_LEFT);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SHOULDER_COLORS_LEFT);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SHOULDER_FACES_LEFT);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, shoulderDataLeft.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= SHOULDERS ========================= */

    /*========================= Hands ========================= */
    // Draw Hands
    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, HANDS_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, HANDS_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX2);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS2);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES2);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, HANDS_LEFT2.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= Hands ========================= */

    /*========================= Legs ========================= */
    // thigh
    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PAHA_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KANAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, PAHA_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PAHA_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KIRI_MATRIX);

    GL.drawElements(GL.TRIANGLES, PAHA_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KANAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, KAKI_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KIRI_MATRIX);

    GL.drawElements(GL.TRIANGLES, KAKI_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);

    // Foot
    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELAPAK_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KANAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, TELAPAK_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELAPAK_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KIRI_MATRIX);

    GL.drawElements(GL.TRIANGLES, TELAPAK_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= Legs ========================= */

    /*========================= WEAPONS ========================= */
    GL.bindBuffer(GL.ARRAY_BUFFER, tabungVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, tabungColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tabungFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, SABER_MATRIX);

    GL.drawElements(GL.TRIANGLES, tabung.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SABER_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, SABER_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SABER_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, SABER_MATRIX);

    GL.drawElements(GL.TRIANGLES, tabung.faces.length, GL.UNSIGNED_SHORT, 0);

    // Eye of gun
    GL.bindBuffer(GL.ARRAY_BUFFER, gunVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, gunColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gunFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, ROBOT_VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, SABER_MATRIX);

    GL.drawElements(GL.TRIANGLES, gun.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= WEAPONS ========================= */

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener("load", main);
