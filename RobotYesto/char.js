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

  // CANVAS.addEventListener("mousedown", mouseDown, false);
  // CANVAS.addEventListener("mouseup", mouseUP, false);
  // CANVAS.addEventListener("mouseout", mouseOut, false);
  // CANVAS.addEventListener("mousemove", mouseMove, false);

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

  /*========================= MATRIX ========================= */
  var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
  var VIEW_MATRIX = LIBS.get_I4();
  var MODEL_MATRIX = LIBS.get_I4();

  // kepala
  var KEPALA_MATRIX = LIBS.get_I4();

  // badan
  var BADAN_MATRIX = LIBS.get_I4();

  // tangan kanan
  var TANGAN_KANAN_MATRIX = LIBS.get_I4();

  // tangan kiri
  var TANGAN_KIRI_MATRIX = LIBS.get_I4();

  // Kaki kanan
  var KAKI_KANAN_MATRIX = LIBS.get_I4();

  // Kaki kanan
  var KAKI_KIRI_MATRIX = LIBS.get_I4();

  // gun eye
  var GUN_BULLET_MATRIX = LIBS.get_I4();

  LIBS.translateZ(VIEW_MATRIX, -15);

  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var then = 0;

  var KakiKananTime = 0;
  var KakiKananReverse = false;

  var KakiKiriTime = 0;
  var KakiKiriReverse = false;

  var animateRobot = function (time) {
    GL.viewport(0, 0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    time *= 0.001;

    var deltaTime = (time - then) * 100;
    then = time;

    if (!drag) {
      dx *= friction;
      dy *= friction;

      theta += (dx * 2 * Math.PI) / CANVAS.width;
      alpha += (dy * 2 * Math.PI) / CANVAS.height;
    }

    /*========================= TIME ========================= */

    // Kepala
    KEPALA_MATRIX = LIBS.get_I4();
    // Badan
    BADAN_MATRIX = LIBS.get_I4();
    // Tangan Kanan
    TANGAN_KANAN_MATRIX = LIBS.get_I4();
    // Tangan Kiri
    TANGAN_KIRI_MATRIX = LIBS.get_I4();

    // Kaki Kanan
    KAKI_KANAN_MATRIX = LIBS.get_I4();
    var KF_KakiKanan = 0;

    if (time < 10) {
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

    if (time < 10) {
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

    MODEL_MATRIX = LIBS.get_I4();

    /*========================= ANIMASI ========================= */
    LIBS.rotateY(MODEL_MATRIX, theta);
    LIBS.rotateX(MODEL_MATRIX, alpha);

    // BADAN
    LIBS.rotateY(BADAN_MATRIX, theta);
    LIBS.rotateX(BADAN_MATRIX, alpha);

    // KEPALA
    LIBS.rotateY(KEPALA_MATRIX, theta);
    LIBS.rotateX(KEPALA_MATRIX, alpha);

    // TANGAN KANAN
    LIBS.rotateY(TANGAN_KANAN_MATRIX, theta);
    LIBS.rotateX(TANGAN_KANAN_MATRIX, alpha);

    // TANGAN KIRI
    LIBS.rotateY(TANGAN_KIRI_MATRIX, theta);
    LIBS.rotateX(TANGAN_KIRI_MATRIX, alpha);

    // KAKI KANAN
    LIBS.rotateX(KAKI_KANAN_MATRIX, KF_KakiKanan);
    LIBS.rotateY(KAKI_KANAN_MATRIX, theta);
    LIBS.rotateX(KAKI_KANAN_MATRIX, alpha);

    // KAKI KIRI
    LIBS.rotateX(KAKI_KIRI_MATRIX, KF_KakiKiri);
    LIBS.rotateY(KAKI_KIRI_MATRIX, theta);
    LIBS.rotateX(KAKI_KIRI_MATRIX, alpha);


    /*========================= HEAD ========================= */
    // Draw first octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaATAS_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaATAS_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaATAS_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KEPALA_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, kepalaATAS.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw second octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaTENGAH_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaTENGAH_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaTENGAH_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KEPALA_MATRIX);

    GL.drawElements(GL.TRIANGLE_FAN, kepalaTENGAH.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw third octagon
    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaBAWAH_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, kepalaBAWAH_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepalaBAWAH_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KEPALA_MATRIX);

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
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KEPALA_MATRIX);

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
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, MAIN_BODY.faces.length, GL.UNSIGNED_SHORT, 0);

    // Bottom
    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BODY_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BODY_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_BODY_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, BADAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, shoulderDataRight.faces.length, GL.UNSIGNED_SHORT, 0);

    // Draw left shoulder
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
    // Draw Hands
    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, TANGAN_KANAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, HANDS_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, HANDS_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, HANDS_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, TANGAN_KIRI_MATRIX);

    GL.drawElements(GL.TRIANGLES, HANDS_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= Hands ========================= */

    /*========================= Legs ========================= */
    // thigh
    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PAHA_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KANAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, PAHA_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, PAHA_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, PAHA_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KIRI_MATRIX);

    GL.drawElements(GL.TRIANGLES, PAHA_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);

    // Right leg
    // var MODEL_MATRIX_RIGHT_LEG = LIBS.get_I4();
    // var rightLegMovement = Math.abs(Math.sin((time * 2 * Math.PI) / 15)); // Vertical movement for 15 seconds
    // var rightLegOffset = rightLegMovement * 0.5; // Adjust this value to control the range of motion
    // LIBS.translateY(MODEL_MATRIX_RIGHT_LEG, rightLegOffset); // Apply vertical translation to right leg
    // MODEL_MATRIX_RIGHT_LEG = LIBS.multiply(MODEL_MATRIX, MODEL_MATRIX_RIGHT_LEG);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KANAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, KAKI_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    // Left leg
    // var MODEL_MATRIX_LEFT_LEG = LIBS.get_I4();
    // var leftLegMovement = Math.abs(Math.sin((time * 2 * Math.PI) / 15)); // Vertical movement for 15 seconds
    // var leftLegOffset = leftLegMovement * 0.5; // Adjust this value to control the range of motion
    // LIBS.translateY(MODEL_MATRIX_LEFT_LEG, leftLegOffset); // Apply vertical translation to left leg
    // MODEL_MATRIX_LEFT_LEG = LIBS.multiply(MODEL_MATRIX, MODEL_MATRIX_LEFT_LEG);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, KAKI_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, KAKI_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KIRI_MATRIX);

    GL.drawElements(GL.TRIANGLES, KAKI_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);

    // Apply the same transformation to the foot cubes
    // var MODEL_MATRIX_FOOT = LIBS.get_I4();
    // LIBS.translateY(MODEL_MATRIX_FOOT, leftLegOffset); // Assuming left leg movement is used for the foot as well
    // MODEL_MATRIX_FOOT = LIBS.multiply(MODEL_MATRIX, MODEL_MATRIX_FOOT);

    // Foot
    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_RIGHT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_RIGHT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELAPAK_RIGHT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, KAKI_KANAN_MATRIX);

    GL.drawElements(GL.TRIANGLES, TELAPAK_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_LEFT_VERTEX);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, TELAPAK_LEFT_COLORS);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TELAPAK_LEFT_FACES);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
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
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, TANGAN_KIRI_MATRIX);

    GL.drawElements(GL.TRIANGLES, tabung.faces.length, GL.UNSIGNED_SHORT, 0);

    // Eye of gun
    GL.bindBuffer(GL.ARRAY_BUFFER, gunVertex);
    GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ARRAY_BUFFER, gunColors);
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, gunFaces);

    GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(_MMatrix, false, GUN_BULLET_MATRIX);

    GL.drawElements(GL.TRIANGLES, gun.faces.length, GL.UNSIGNED_SHORT, 0);
    /*========================= WEAPONS ========================= */

    GL.flush();

    window.requestAnimationFrame(animateRobot);
  };

  animateRobot(0);
}

window.addEventListener("load", main);
