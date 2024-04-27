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
  /*========================= ROBOT ========================= */
  /*========================================================= */

  /*========================= HEAD ========================= */
  // top part of robot head
  // x, y, z, outerRadius, innerRadius, height, segments, color
  var kepalaATAS = generateSolidOctagon(0, 0.85, 0, 2, 1, 1.3, 8, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the first octagon
  var kepalaATAS_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kepalaATAS_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepalaATAS.vertices), GL.STATIC_DRAW);

  var kepalaATAS_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kepalaATAS_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepalaATAS.colors), GL.STATIC_DRAW);

  var kepalaATAS_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaATAS_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kepalaATAS.faces), GL.STATIC_DRAW);

  // middle part of robot head
  var kepalaTENGAH = generateSolidOctagon(0, -0.15, 0, 1, 1.6, 0.7, 8, [0, 0, 0]);

  // Create buffers for the second octagon
  var kepalaTENGAH_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kepalaTENGAH_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepalaTENGAH.vertices), GL.STATIC_DRAW);

  var kepalaTENGAH_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kepalaTENGAH_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepalaTENGAH.colors), GL.STATIC_DRAW);

  var kepalaTENGAH_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaTENGAH_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kepalaTENGAH.faces), GL.STATIC_DRAW);

  // bottom part of robot head
  var kepalaBAWAH = generateSolidOctagon(0, -1, 0, 2, 1, 1, 8, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the third octagon
  var kepalaBAWAH_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kepalaBAWAH_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepalaBAWAH.vertices), GL.STATIC_DRAW);

  var kepalaBAWAH_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, kepalaBAWAH_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(kepalaBAWAH.colors), GL.STATIC_DRAW);

  var kepalaBAWAH_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaBAWAH_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(kepalaBAWAH.faces), GL.STATIC_DRAW);
  /*========================= HEAD ========================= */

  /*========================= MATA ========================= */
  // eyes of robot head
  var MATA = generateSphere(0, -0.15, 1.82, 0.4, 16);

  // Create buffers for the sphere
  var MATA_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, MATA_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(MATA.vertices), GL.STATIC_DRAW);

  var MATA_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, MATA_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(MATA.colors), GL.STATIC_DRAW);

  var MATA_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MATA_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(MATA.faces), GL.STATIC_DRAW);
  /*========================= MATA ========================= */

  /*========================= BODY ========================= */
  // x, y, z, width, height, depth, color
  var MAIN_BODY = generateCube(0, -3.27, 0, 3.95, 3.5, 2, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var MAIN_BODY_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(MAIN_BODY.vertices), GL.STATIC_DRAW);

  var MAIN_BODY_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, MAIN_BODY_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(MAIN_BODY.colors), GL.STATIC_DRAW);

  var MAIN_BODY_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, MAIN_BODY_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(MAIN_BODY.faces), GL.STATIC_DRAW);

  // x, y, z, width, height, depth, color
  var BOTTOM_BODY = generateCube(0, -5.2, 0, 1.7, 0.5, 2, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var BOTTOM_BODY_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BODY_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(BOTTOM_BODY.vertices), GL.STATIC_DRAW);

  var BOTTOM_BODY_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BODY_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(BOTTOM_BODY.colors), GL.STATIC_DRAW);

  var BOTTOM_BODY_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_BODY_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(BOTTOM_BODY.faces), GL.STATIC_DRAW);
  /*========================= BODY ========================= */

  /*========================= Armor Plate ========================= */
  var ARMOR = generateCube(0, -3.15, 1.2, 3.5, 2.7, 0.7, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var ARMOR_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, ARMOR_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ARMOR.vertices), GL.STATIC_DRAW);

  var ARMOR_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, ARMOR_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(ARMOR.colors), GL.STATIC_DRAW);

  var ARMOR_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ARMOR_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(ARMOR.faces), GL.STATIC_DRAW);

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
  var HANDS_RIGHT = generateCube(2.6, -3.55, 0.1, 0.8, 2.2, 0.67, [66 / 256, 94 / 256, 96 / 256]);

  // Create buffers for the cube
  var HANDS_RIGHT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_RIGHT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_RIGHT.vertices), GL.STATIC_DRAW);

  var HANDS_RIGHT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_RIGHT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_RIGHT.colors), GL.STATIC_DRAW);

  var HANDS_RIGHT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_RIGHT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(HANDS_RIGHT.faces), GL.STATIC_DRAW);

  // kiri (dri depan)
  var HANDS_LEFT = generateCube(-2.6, -3.25, 0.1, 0.8, 1, 0.67, [66 / 256, 94 / 256, 96 / 256]);

  // Create buffers for the cube
  var HANDS_LEFT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_LEFT.vertices), GL.STATIC_DRAW);

  var HANDS_LEFT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(HANDS_LEFT.colors), GL.STATIC_DRAW);

  var HANDS_LEFT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(HANDS_LEFT.faces), GL.STATIC_DRAW);
  /*========================= Hands ========================= */

  /*========================= Legs ========================= */
  // thigh
  // x, y, z, width, height, depth, color
  var PAHA_RIGHT = generateCube(1.37, -5.71, 0.15, 1, 1.35, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var PAHA_RIGHT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_RIGHT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(PAHA_RIGHT.vertices), GL.STATIC_DRAW);

  var PAHA_RIGHT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_RIGHT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(PAHA_RIGHT.colors), GL.STATIC_DRAW);

  var PAHA_RIGHT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PAHA_RIGHT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(PAHA_RIGHT.faces), GL.STATIC_DRAW);

  // x, y, z, width, height, depth, color
  var PAHA_LEFT = generateCube(-1.37, -5.71, 0.15, 1, 1.35, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var PAHA_LEFT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_LEFT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(PAHA_LEFT.vertices), GL.STATIC_DRAW);

  var PAHA_LEFT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_LEFT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(PAHA_LEFT.colors), GL.STATIC_DRAW);

  var PAHA_LEFT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PAHA_LEFT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(PAHA_LEFT.faces), GL.STATIC_DRAW);

  // Legs
  // x, y, z, width, height, depth, color
  var KAKI_RIGHT = generateCube(1.37, -7, 0.15, 0.8, 1.35, 0.8, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var KAKI_RIGHT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_RIGHT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(KAKI_RIGHT.vertices), GL.STATIC_DRAW);

  var KAKI_RIGHT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_RIGHT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(KAKI_RIGHT.colors), GL.STATIC_DRAW);

  var KAKI_RIGHT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_RIGHT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(KAKI_RIGHT.faces), GL.STATIC_DRAW);

  // x, y, z, width, height, depth, color
  var KAKI_LEFT = generateCube(-1.37, -7, 0.15, 0.8, 1.35, 0.8, [100 / 256, 140 / 256, 139 / 256]);

  // Create buffers for the cube
  var KAKI_LEFT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_LEFT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(KAKI_LEFT.vertices), GL.STATIC_DRAW);

  var KAKI_LEFT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_LEFT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(KAKI_LEFT.colors), GL.STATIC_DRAW);

  var KAKI_LEFT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_LEFT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(KAKI_LEFT.faces), GL.STATIC_DRAW);

  // Foot
  // x, y, z, width, height, depth, color
  var TELAPAK_RIGHT = generateCube(1.37, -7.9, 0.3, 1, 0.5, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var TELAPAK_RIGHT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_RIGHT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(TELAPAK_RIGHT.vertices), GL.STATIC_DRAW);

  var TELAPAK_RIGHT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_RIGHT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(TELAPAK_RIGHT.colors), GL.STATIC_DRAW);

  var TELAPAK_RIGHT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELAPAK_RIGHT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(TELAPAK_RIGHT.faces), GL.STATIC_DRAW);

  // x, y, z, width, height, depth, color
  var TELAPAK_LEFT = generateCube(-1.37, -7.9, 0.3, 1, 0.5, 1.2, [172 / 256, 189 / 256, 190 / 256]);

  // Create buffers for the cube
  var TELAPAK_LEFT_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_LEFT_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(TELAPAK_LEFT.vertices), GL.STATIC_DRAW);

  var TELAPAK_LEFT_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_LEFT_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(TELAPAK_LEFT.colors), GL.STATIC_DRAW);

  var TELAPAK_LEFT_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELAPAK_LEFT_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(TELAPAK_LEFT.faces), GL.STATIC_DRAW);
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

  /*========================= KECILIN ROBOT ========================= */
  var scaleFactor = 0.1;
  var childRobot = [
    kepalaATAS,
    kepalaTENGAH,
    kepalaBAWAH,
    MATA,
    MAIN_BODY,
    BOTTOM_BODY,
    ARMOR,
    shoulderDataRight,
    shoulderDataLeft,
    HANDS_RIGHT,
    HANDS_LEFT,
    PAHA_RIGHT,
    PAHA_LEFT,
    KAKI_RIGHT,
    KAKI_LEFT,
    TELAPAK_RIGHT,
    TELAPAK_LEFT,
    tabung,
    gun
  ];

  for (var i = 0; i < childRobot.length; i++) {
    childRobot[i].vertices = childRobot[i].vertices.map((coord) => coord * scaleFactor);
  }

  // GESER(?)
  var geserX = 0;
  var geserY = 0.5;
  var geserZ = 5;

  for (var i = 0; i < childRobot.length; i++) {
    for (var j = 0; j < childRobot[i].vertices.length; j += 3) {
      childRobot[i].vertices[j] += geserX;
    }
    for (var j = 1; j < childRobot[i].vertices.length; j += 3) {
      childRobot[i].vertices[j] += geserY;
    }
    for (var j = 2; j < childRobot[i].vertices.length; j += 3) {
      childRobot[i].vertices[j] += geserZ;
    }
  }

  /*========================================================= */
  /*======================== END ROBOT ====================== */
  /*========================================================= */

  /*========================================================= */
  /*====================== ENVIROMENT ======================= */
  /*========================================================= */

  var world = generateWorld(25, 25, 0.3);

  var WORLD_VERTEX = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, WORLD_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(world.vertices), GL.STATIC_DRAW);

  var WORLD_COLORS = GL.createBuffer();
  GL.bindBuffer(GL.ARRAY_BUFFER, WORLD_COLORS);
  GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(world.colors), GL.STATIC_DRAW);

  var WORLD_FACES = GL.createBuffer();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, WORLD_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(world.faces), GL.STATIC_DRAW);

  var wall1 = generateCube(0, 2, 0, 3, 3, 3, [0, 0, 0]);

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

  /*========================= MATRIX ROBOT ======================== */
  // badan
  var BADAN_MATRIX = LIBS.get_I4();

  // Kaki kanan
  var KAKI_KANAN_MATRIX = LIBS.get_I4();

  // Kaki kanan
  var KAKI_KIRI_MATRIX = LIBS.get_I4();

  // gun eye
  var GUN_BULLET_MATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEW_MATRIX, -100);
  LIBS.translateY(VIEW_MATRIX, -2);

  /*========================= MATRIX ENV ========================= */
  var WORLD_MATRIX = LIBS.get_I4();
  var WALL1_MATRIX = LIBS.get_I4();

  /*=========================================================== */
  /*========================= DRAWING ========================= */
  /*=========================================================== */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var then = 0;

  var KakiKananTime = 0;
  var KakiKananReverse = false;

  var KakiKiriTime = 0;
  var KakiKiriReverse = false;

  /*=========================================================== */
  /*========================= ANIMATE ========================= */
  /*=========================================================== */
  var animateRobot = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    time *= 0.001;

    var deltaTime = (time - then) * 100;
    then = time;

    /*========================= TIME ========================= */

    /*========================= ROBOT TIME ========================= */
    // Badan
    BADAN_MATRIX = LIBS.get_I4();

    // Kaki Kanan
    KAKI_KANAN_MATRIX = LIBS.get_I4();
    var KF_KakiKanan = 0;

    if (time < 20) {
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

    if (time < 20) {
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

    GUN_BULLET_MATRIX = LIBS.get_I4();
    /*========================= ROBOT TIME ========================= */

    /*========================= WORLD ANIMASI ========================= */
    WORLD_MATRIX = LIBS.get_I4();
    LIBS.rotateY(WORLD_MATRIX, theta);

    WALL1_MATRIX = LIBS.get_I4();
    LIBS.rotateY(WALL1_MATRIX, theta);
    /*========================= WORLD ANIMASI ========================= */

    // MODEL_MATRIX = LIBS.get_I4();

    /*========================= ROBOT ANIMASI ========================= */
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

    // GUN BULLET
    LIBS.rotateY(GUN_BULLET_MATRIX, theta);
    LIBS.rotateX(GUN_BULLET_MATRIX, alpha);
    /*========================= ROBOT ANIMASI ========================= */

    /*================================================================= */
    /*=========================== ROBOT DRAW ========================== */
    /*================================================================= */


    /*================================================================= */
    /*=========================== WORLD DRAW ========================== */
    /*================================================================= */
    GL.bindBuffer(GL.ARRAY_BUFFER, WORLD_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, WORLD_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, WORLD_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);

    GL.drawElements(GL.TRIANGLES, world.faces.length, GL.UNSIGNED_SHORT, 0);

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
