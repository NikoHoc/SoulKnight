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
  
    // ========================== UFO (LEG) ==================================
    // UFO1 dark grey
    var ufo1 = generateUFO(2.5, 2.5, 1.2, 30, 0, -1.4, 0, [0.44, 0.44, 0.52]);
    // Create buffers
    var ufo1_vertex = createVertexBuffer(GL, ufo1.vertices);
    var ufo1_colors = createColorBuffer(GL, ufo1.colors);
    var ufo1_faces = createFacesBuffer(GL, ufo1.faces);
  
    // UFO2 Yellow
    var ufo2 = generateUFO(2.2, 2.2, 1.5, 40, 0, -1.4, 0, [1, 0.85, 0.21]);
    // Create buffers
    var ufo2_vertex = createVertexBuffer(GL, ufo2.vertices);
    var ufo2_colors = createColorBuffer(GL, ufo2.colors);
    var ufo2_faces = createFacesBuffer(GL, ufo2.faces);
  
    // UFO3 bottom
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
    var ARMOR_FACES = createFacesBuffer(GL, ARMOR.faces);
  
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
    /*========================= KNIGHT ========================= */
    /*========================================================= */

    var cube = [
      //badan
      //belakang
      -0.6, -0.6, -0.6, 0.3, 0.3, 0.3,
       0.6, -0.6, -0.6, 0.5, 0.5, 0.5,
        0.6, 0.4, -0.6, 0.3, 0.3, 0.3, 
        -0.6, 0.4, -0.6, 0.3, 0.3,0.3,
  
      //depan
      -0.6, -0.6, 0.6, 0.3, 0.3, 0.3,
       0.6, -0.6, 0.6, 0.3, 0.3, 0.3,
        0.6, 0.4, 0.6, 0.3, 0.3, 0.3,
         -0.6, 0.4, 0.6, 0.3, 0.3, 0.3,
  
      //kiri
      -0.6, -0.6, -0.6, 0.3, 0.3, 0.3,
       -0.6, 0.4, -0.6, 0.3, 0.3, 0.3,
        -0.6, 0.4, 0.6, 0.3, 0.3, 0.3,
         -0.6, -0.6, 0.6, 0.3, 0.3, 0.3,
  
      //kanan
      0.6, -0.6, -0.6, 0.5, 0.5, 0.5,
       0.6, 0.4, -0.6, 0.3, 0.3, 0.3,
        0.6, 0.4, 0.6, 0.3, 0.3, 0.3,
         0.6, -0.6, 0.6, 0.3, 0.3, 0.3,
  
      //bawah
      -0.6, -0.6, -0.6, 0.3, 0.3, 0.3,
       -0.6, -0.6, 0.6, 0.3, 0.3, 0.3,
        0.6, -0.6, 0.6, 0.3, 0.3, 0.3, 
        0.6, -0.6, -0.6, 0.3, 0.3, 0.3,
  
      //atas
      -0.6, 0.4, -0.6, 0.5, 0.5, 0.5,
       -0.6, 0.4, 0.6, 0.5, 0.5, 0.5,
        0.6, 0.4, 0.6, 0.5, 0.5, 0.5,
         0.6, 0.4, -0.6, 1, 1, 1,

      //kepala
      //belakang
      -0.7, 0.4, -0.8, 0.3, 0.3, 0.3,
       0.7, 0.4, -0.8, 0.3, 0.3, 0.3,
        0.7, 1.6, -0.8, 0.3, 0.3, 0.3, 
        -0.7, 1.6, -0.8, 0.3, 0.3,0.3,
  
      //depan
      -0.7, 0.4, 0.8, 1 ,0.992 ,0.815,
      0.7, 0.4, 0.8, 1 ,0.992 ,0.815,
      0.7, 1.6, 0.8, 1 ,0.992 ,0.815,
      -0.7, 1.6, 0.8, 1 ,0.992 ,0.815,
  
      //kiri
      -0.7, 0.4, -0.8, 0.3, 0.3, 0.3,
       -0.7, 1.6, -0.8, 0.3, 0.3, 0.3,
        -0.7, 1.6, 0.8, 0.3, 0.3, 0.3,
         -0.7, 0.4, 0.8, 0.3, 0.3, 0.3,
  
      //kanan
      0.7, 0.4, -0.8, 0.3, 0.3, 0.3,
       0.7, 1.6, -0.8, 0.3, 0.3, 0.3,
        0.7, 1.6, 0.8, 0.3, 0.3, 0.3,
         0.7, 0.4, 0.8, 0.3, 0.3, 0.3,
  
      //bawah
      -0.7, 0.4, -0.8, 1 ,0.992 ,0.815,
       -0.7, 0.4, 0.8, 1 ,0.992 ,0.815,
        0.7, 0.4, 0.8, 1 ,0.992 ,0.815, 
        0.7, 0.4, -0.8, 1 ,0.992 ,0.815,
  
      //atas
      -0.7, 1.6, -0.8, 0.3, 0.3, 0.3,
       -0.7, 1.6, 0.8, 0.3, 0.3, 0.3,
        0.7, 1.6, 0.8, 0.3, 0.3, 0.3,
         0.7, 1.6, -0.8, 0.5, 0.5, 0.5,


      //face
      //mata kiri
      -0.4, 0.9, 0.81, 0, 0, 0,
      -0.25, 0.9, 0.81, 0, 0, 0,
      -0.25, 1.1, 0.81, 0, 0, 0,
      -0.4, 1.1, 0.81, 0, 0, 0,

      //mata kanan
      0.4, 0.9, 0.81, 0, 0, 0,
      0.25, 0.9, 0.81, 0, 0, 0,
      0.25, 1.1, 0.81, 0, 0, 0,
      0.4, 1.1, 0.81, 0, 0, 0,


      //mulut
      -0.2, 0.6, 0.81, 0.913, 0.588, 0.472,
      0.2, 0.6, 0.81, 0.913, 0.588, 0.472,
      0.2, 0.7, 0.81, 0.913, 0.588, 0.472,
      -0.2, 0.7, 0.81, 0.913, 0.588, 0.472,


      //face armor
      //atas
      -0.7, 1.1, 0.8005, 0.3 ,0.3 ,0.3,
      0.7, 1.1, 0.8005, 0.3 ,0.3 ,0.3,
      0.7, 1.6, 0.8005, 0.3 ,0.3 ,0.3,
      -0.7, 1.6, 0.8005, 0.3 ,0.3 ,0.3,

      //bagian kiri
      -0.7, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      -0.5, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      -0.5, 1.6, 0.8005, 0.3 ,0.3 ,0.3,
      -0.7, 1.6, 0.8005, 0.3 ,0.3 ,0.3,

      //bagian kanan
      0.7, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      0.5, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      0.5, 1.6, 0.8005, 0.3 ,0.3 ,0.3,
      0.7, 1.6, 0.8005, 0.3 ,0.3 ,0.3,

      //bagian kiri bawah
      -0.7, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      -0.4, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      -0.4, 0.8, 0.8005, 0.3 ,0.3 ,0.3,
      -0.7, 0.8, 0.8005, 0.3 ,0.3 ,0.3,

      //bagian kanan bawah
      0.7, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      0.4, 0.4, 0.8005, 0.3 ,0.3 ,0.3,
      0.4, 0.8, 0.8005, 0.3 ,0.3 ,0.3,
      0.7, 0.8, 0.8005, 0.3 ,0.3 ,0.3,

      //atas kuning
      //depan
      -0.6, 1.1, 0.9, 1 ,1 ,0,
      0.6, 1.1, 0.9, 1 ,1 ,0,
      0.6, 1.2, 0.9, 1,1 ,0,
      -0.6, 1.2, 0.9, 1,1 ,0,
      
      //kiri
      -0.6, 1.1, 0.8006, 1 ,1 ,0,
      -0.6, 1.1, 0.9, 1 ,1 ,0,
      -0.6, 1.2, 0.9, 1,1 ,0,
      -0.6, 1.2, 0.8006, 1,1 ,0,

      //kanan
      0.6, 1.1, 0.8006, 1 ,1 ,0,
      0.6, 1.1, 0.9, 1 ,1 ,0,
      0.6, 1.2, 0.9, 1,1 ,0,
      0.6, 1.2, 0.8006, 1,1 ,0,

      //bawah
      -0.6, 1.1, 0.8006, 1, 1, 0,
      -0.6, 1.1, 0.9, 1, 1, 0,
      0.6, 1.1, 0.9, 1, 1, 0, 
      0.6, 1.1, 0.8006, 1, 1,0,

      //atas
      -0.6, 1.2, 0.8006, 1, 1, 0,
      -0.6, 1.2, 0.9, 1, 1, 0,
      0.6, 1.2, 0.9, 1, 1, 0, 
      0.6, 1.2, 0.8006, 1, 1,0,

      //samping kuning kiri

      //bagian atas
      //depan atas
      -0.6, 0.8, 0.9, 1 ,1 ,0,
      -0.5, 0.8, 0.9, 1 ,1 ,0,
      -0.5, 1.2, 0.9, 1,1 ,0,
      -0.6, 1.2, 0.9, 1,1 ,0,

      //kiri atas
      -0.6, 0.8, 0.8006, 1 ,1 ,0,
      -0.6, 0.8, 0.9, 1 ,1 ,0,
      -0.6, 1.2, 0.9, 1,1 ,0,
      -0.6, 1.2, 0.8006, 1,1 ,0,

      //kanan atas
      -0.5, 0.8, 0.8006, 1 ,1 ,0,
      -0.5, 0.8, 0.9, 1 ,1 ,0,
      -0.5, 1.2, 0.9, 1,1 ,0,
      -0.5, 1.2, 0.8006, 1,1 ,0,

      //bagian tengah
      //depan bawah
      -0.6, 0.7, 0.9, 1 ,1 ,0,
      -0.4, 0.7, 0.9, 1 ,1 ,0,
      -0.4, 0.8, 0.9, 1,1 ,0,
      -0.6, 0.8, 0.9, 1,1 ,0,

      //kiri bawah
      -0.6, 0.7, 0.8006, 1 ,1 ,0,
      -0.6, 0.7, 0.9, 1 ,1 ,0,
      -0.6, 0.8, 0.9, 1,1 ,0,
      -0.6, 0.8, 0.8006, 1,1 ,0,

      //kanan bawah
      -0.4, 0.7, 0.8006, 1 ,1 ,0,
      -0.4, 0.7, 0.9, 1 ,1 ,0,
      -0.4, 0.8, 0.9, 1,1 ,0,
      -0.4, 0.8, 0.8006, 1,1 ,0,

      //atas bawah
      -0.6, 0.7, 0.8006, 1 ,1 ,0,
      -0.6, 0.7, 0.9, 1 ,1 ,0,
      -0.4, 0.7, 0.9, 1,1 ,0,
      -0.4, 0.7, 0.8006, 1,1 ,0,

      //atas atas
      -0.6, 0.8, 0.8006, 1 ,1 ,0,
      -0.6, 0.8, 0.9, 1 ,1 ,0,
      -0.4, 0.8, 0.9, 1,1 ,0,
      -0.4, 0.8, 0.8006, 1,1 ,0,

      //bagian bawah
      //depan bawah2
      -0.5, 0.8, 0.9, 1 ,1 ,0,
      -0.4, 0.8, 0.9, 1 ,1 ,0,
      -0.4, 0.4, 0.9, 1,1 ,0,
      -0.5, 0.4, 0.9, 1,1 ,0,

      //kiri bawah2
      -0.5, 0.8, 0.8006, 1 ,1 ,0,
      -0.5, 0.8, 0.9, 1 ,1 ,0,
      -0.5, 0.4, 0.9, 1,1 ,0,
      -0.5, 0.4, 0.8006, 1,1 ,0,

      //kanan bawah2
      -0.4, 0.8, 0.8006, 1 ,1 ,0,
      -0.4, 0.8, 0.9, 1 ,1 ,0,
      -0.4, 0.4, 0.9, 1,1 ,0,
      -0.4, 0.4, 0.8006, 1,1 ,0,

      //bawah bawah2
      -0.5, 0.4, 0.8006, 1 ,1 ,0,
      -0.5, 0.4, 0.9, 1 ,1 ,0,
      -0.4, 0.4, 0.9, 1,1 ,0,
      -0.4, 0.4, 0.8006, 1,1 ,0,

      //samping kuning kanan

      //bagian atas
      //depan atas
      0.6, 0.8, 0.9, 1 ,1 ,0,
      0.5, 0.8, 0.9, 1 ,1 ,0,
      0.5, 1.2, 0.9, 1,1 ,0,
      0.6, 1.2, 0.9, 1,1 ,0,

      //kiri atas
      0.6, 0.8, 0.8006, 1 ,1 ,0,
      0.6, 0.8, 0.9, 1 ,1 ,0,
      0.6, 1.2, 0.9, 1,1 ,0,
      0.6, 1.2, 0.8006, 1,1 ,0,

      //kanan atas
      0.5, 0.8, 0.8006, 1 ,1 ,0,
      0.5, 0.8, 0.9, 1 ,1 ,0,
      0.5, 1.2, 0.9, 1,1 ,0,
      0.5, 1.2, 0.8006, 1,1 ,0,

      //bagian tengah
      //depan bawah
      0.6, 0.7, 0.9, 1 ,1 ,0,
      0.4, 0.7, 0.9, 1 ,1 ,0,
      0.4, 0.8, 0.9, 1,1 ,0,
      0.6, 0.8, 0.9, 1,1 ,0,

      //kiri bawah
      0.6, 0.7, 0.8006, 1 ,1 ,0,
      0.6, 0.7, 0.9, 1 ,1 ,0,
      0.6, 0.8, 0.9, 1,1 ,0,
      0.6, 0.8, 0.8006, 1,1 ,0,

      //kanan bawah
      0.4, 0.7, 0.8006, 1 ,1 ,0,
      0.4, 0.7, 0.9, 1 ,1 ,0,
      0.4, 0.8, 0.9, 1,1 ,0,
      0.4, 0.8, 0.8006, 1,1 ,0,

      //atas bawah
      0.6, 0.7, 0.8006, 1 ,1 ,0,
      0.6, 0.7, 0.9, 1 ,1 ,0,
      0.4, 0.7, 0.9, 1,1 ,0,
      0.4, 0.7, 0.8006, 1,1 ,0,

      //atas atas
      0.6, 0.8, 0.8006, 1 ,1 ,0,
      0.6, 0.8, 0.9, 1 ,1 ,0,
      0.4, 0.8, 0.9, 1,1 ,0,
      0.4, 0.8, 0.8006, 1,1 ,0,

      //bagian bawah
      //depan bawah2
      0.5, 0.8, 0.9, 1 ,1 ,0,
      0.4, 0.8, 0.9, 1 ,1 ,0,
      0.4, 0.4, 0.9, 1,1 ,0,
      0.5, 0.4, 0.9, 1,1 ,0,

      //kiri bawah2
      0.5, 0.8, 0.8006, 1 ,1 ,0,
      0.5, 0.8, 0.9, 1 ,1 ,0,
      0.5, 0.4, 0.9, 1,1 ,0,
      0.5, 0.4, 0.8006, 1,1 ,0,

      //kanan bawah2
      0.4, 0.8, 0.8006, 1 ,1 ,0,
      0.4, 0.8, 0.9, 1 ,1 ,0,
      0.4, 0.4, 0.9, 1,1 ,0,
      0.4, 0.4, 0.8006, 1,1 ,0,

      //bawah bawah2
      0.5, 0.4, 0.8006, 1 ,1 ,0,
      0.5, 0.4, 0.9, 1 ,1 ,0,
      0.4, 0.4, 0.9, 1,1 ,0,
      0.4, 0.4, 0.8006, 1,1 ,0,


      //syal
      //belakang
      -0.65, -0.1, -0.61, 1, 0, 0,
       0.65, -0.1, -0.61, 1, 0, 0,
        0.65, 0.4, -0.61, 1, 0, 0, 
        -0.65, 0.4, -0.61, 1, 0, 0,
  
      //depan
      -0.65, -0.1, 0.61, 1, 0, 0,
       0.65, -0.1, 0.61, 1, 0, 0,
        0.65, 0.4, 0.61, 1, 0, 0,
         -0.65, 0.4, 0.61, 1, 0, 0,
  
      //kiri
      -0.65, -0.1, -0.61, 1, 0, 0,
       -0.65, 0.4, -0.61, 1, 0, 0,
        -0.65, 0.4, 0.61, 1, 0, 0,
         -0.65, -0.1, 0.61, 1, 0, 0,
  
      //kanan
      0.65, -0.1, -0.61, 1, 0, 0,
       0.65, 0.4, -0.61, 1, 0, 0,
        0.65, 0.4, 0.61, 1, 0, 0,
         0.65, -0.1, 0.61, 1, 0, 0,
  
      //bawah
      -0.65, -0.1, -0.61, 1, 0, 0,
       -0.65, -0.1, 0.61, 1, 0, 0,
        0.65, -0.1, 0.61, 1, 0, 0, 
        0.65, -0.1, -0.61, 1, 0, 0,
  
      //atas
      -0.65, 0.4, -0.61, 1, 0, 0,
      -0.65, 0.4, 0.61, 1, 0, 0,
      0.65, 0.4, 0.61, 1, 0, 0,
      0.65, 0.4, -0.61, 1, 0, 0,

      //scarf 1
      -0.86, -0.1, -0.9, 1, 0, 0,
      -0.86, 0.4, -0.9, 1, 0, 0,
      -0.65, 0.4, -0.61, 1, 0, 0,
      -0.65, -0.1, -0.61, 1, 0, 0,

      //scarf 2
      -1.1, -0.3, -1.2, 1, 0, 0,
      -1.1, -0.09, -1.2, 1, 0, 0,
      -0.71, -0.09, -0.7, 1, 0, 0,
      -0.71, -0.3, -0.7, 1, 0, 0,

      //scarf 3
      -1.1, -0.5, -1.2, 1, 0, 0,
      -1.1, -0.1, -1.2, 1, 0, 0,
      -0.95, -0.1, -1, 1, 0, 0,
      -0.95, -0.5, -1, 1, 0, 0,


      
      //pistol kiri
      //belakang
      -1, -0.4, -0.6, 0.5, 0.5, 0.5,
       -0.8, -0.4, -0.6, 0.5, 0.5, 0.5,
        -0.8, -0.2, -0.4, 0.5, 0.5, 0.5, 
        -1, -0.2, -0.4, 0.5, 0.5,0.5,
  
      //depan
      -1, -0.4, -0.4, 0.5, 0.5, 0.5,
       -0.8, -0.4, -0.4, 0.5, 0.5, 0.5,
        -0.8, -0.2, -0.2, 0.5, 0.5, 0.5, 
        -1, -0.2, -0.2, 0.5, 0.5,0.5,
  
      //kiri
      -1, -0.4, -0.6, 0.5, 0.5, 0.5,
       -1, -0.2, -0.4, 0.5, 0.5, 0.5,
        -1, -0.2, -0.2, 0.5, 0.5, 0.5,
         -1, -0.4, -0.4, 0.5, 0.5, 0.5,
  
      //kanan
      -0.8, -0.4, -0.6, 0.5, 0.5, 0.5,
       -0.8, -0.2, -0.4, 0.5, 0.5, 0.5,
        -0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
         -0.8, -0.4, -0.4, 0.5, 0.5, 0.5,
      //bawah
      -1, -0.4, -0.6, 0.5, 0.5, 0.5,
       -1, -0.4, -0.4, 0.5, 0.5, 0.5,
        -0.8, -0.4, -0.4, 0.5, 0.5, 0.5, 
        -0.8, -0.4, -0.6, 0.5, 0.5, 0.5,
  
      //atas
      -1, -0.2, -0.4, 0.5, 0.5, 0.5,
      -1, -0.2, -0.2, 0.5, 0.5, 0.5,
      -0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
      -0.8, -0.2, -0.4, 0.5, 0.5, 0.5,

      //pistol kiri bagian tengahnya
      //belakang
      -1, -0.2, -0.2, 0.5, 0.5, 0.5,
       -0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
        -0.8, -0, -0.2, 0.5, 0.5, 0.5, 
        -1, -0, -0.2, 0.5, 0.5,0.5,
  
      //depan
      -1, -0.2, 0.8, 0.5, 0.5, 0.5,
       -0.8, -0.2, 0.8, 0.5, 0.5, 0.5,
        -0.8, -0, 1, 0.5, 0.5, 0.5, 
        -1, -0, 1, 0.5, 0.5,0.5,
  
      //kiri
      -1, -0.2, -0.2, 0.5, 0.5, 0.5,
       -1, -0, -0.2, 0.5, 0.5, 0.5,
        -1, -0, 1, 0.5, 0.5, 0.5,
         -1, -0.2, 0.8, 0.5, 0.5, 0.5,
  
      //kanan
      -0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
       -0.8, -0, -0.2, 0.5, 0.5, 0.5,
        -0.8, -0, 1, 0.5, 0.5, 0.5,
         -0.8, -0.2, 0.8, 0.5, 0.5, 0.5,
      //bawah
      -1, -0.2, -0.2, 0.5, 0.5, 0.5,
       -1, -0.2, 0.8, 0.5, 0.5, 0.5,
        -0.8, -0.2, 0.8, 0.5, 0.5, 0.5, 
        -0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
  
      //atas
      -1, -0, -0.2, 0.5, 0.5, 0.5,
      -1, -0, 1, 0.5, 0.5, 0.5,
      -0.8, -0, 1, 0.5, 0.5, 0.5,
      -0.8, -0, -0.2, 0.5, 0.5, 0.5,
      


      //pistol kanan
      //belakang
      1, -0.4, -0.6, 0.5, 0.5, 0.5,
       0.8, -0.4, -0.6, 0.5, 0.5, 0.5,
        0.8, -0.2, -0.4, 0.5, 0.5, 0.5, 
        1, -0.2, -0.4, 0.5, 0.5,0.5,
  
      //depan
      1, -0.4, -0.4, 0.5, 0.5, 0.5,
       0.8, -0.4, -0.4, 0.5, 0.5, 0.5,
        0.8, -0.2, -0.2, 0.5, 0.5, 0.5, 
        1, -0.2, -0.2, 0.5, 0.5,0.5,
  
      //kiri
      1, -0.4, -0.6, 0.5, 0.5, 0.5,
       1, -0.2, -0.4, 0.5, 0.5, 0.5,
        1, -0.2, -0.2, 0.5, 0.5, 0.5,
         1, -0.4, -0.4, 0.5, 0.5, 0.5,
  
      //kanan
      0.8, -0.4, -0.6, 0.5, 0.5, 0.5,
       0.8, -0.2, -0.4, 0.5, 0.5, 0.5,
        0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
         0.8, -0.4, -0.4, 0.5, 0.5, 0.5,
      //bawah
      1, -0.4, -0.6, 0.5, 0.5, 0.5,
       1, -0.4, -0.4, 0.5, 0.5, 0.5,
        0.8, -0.4, -0.4, 0.5, 0.5, 0.5, 
        0.8, -0.4, -0.6, 0.5, 0.5, 0.5,
  
      //atas
      1, -0.2, -0.4, 0.5, 0.5, 0.5,
      1, -0.2, -0.2, 0.5, 0.5, 0.5,
      0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
      0.8, -0.2, -0.4, 0.5, 0.5, 0.5,

      //pistol kanan bagian tengahnya
      //belakang
      1, -0.2, -0.2, 0.5, 0.5, 0.5,
       0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
        0.8, -0, -0.2, 0.5, 0.5, 0.5, 
        1, -0, -0.2, 0.5, 0.5,0.5,
  
      //depan
      1, -0.2, 0.8, 0.5, 0.5, 0.5,
       0.8, -0.2, 0.8, 0.5, 0.5, 0.5,
        0.8, -0, 1, 0.5, 0.5, 0.5, 
        1, -0, 1, 0.5, 0.5,0.5,
  
      //kiri
      1, -0.2, -0.2, 0.5, 0.5, 0.5,
       1, -0, -0.2, 0.5, 0.5, 0.5,
        1, -0, 1, 0.5, 0.5, 0.5,
         1, -0.2, 0.8, 0.5, 0.5, 0.5,
  
      //kanan
      0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
       0.8, -0, -0.2, 0.5, 0.5, 0.5,
        0.8, -0, 1, 0.5, 0.5, 0.5,
         0.8, -0.2, 0.8, 0.5, 0.5, 0.5,
      //bawah
      1, -0.2, -0.2, 0.5, 0.5, 0.5,
       1, -0.2, 0.8, 0.5, 0.5, 0.5,
        0.8, -0.2, 0.8, 0.5, 0.5, 0.5, 
        0.8, -0.2, -0.2, 0.5, 0.5, 0.5,
  
      //atas
      1, -0, -0.2, 0.5, 0.5, 0.5,
      1, -0, 1, 0.5, 0.5, 0.5,
      0.8, -0, 1, 0.5, 0.5, 0.5,
      0.8, -0, -0.2, 0.5, 0.5, 0.5,
      
    ];

  
    var cube_faces = [
      
      0, 1, 2, 0, 2, 3,
  
      4, 5, 6, 4, 6, 7,
  
      8, 9, 10, 8, 10, 11,
  
      12, 13, 14, 12, 14, 15,
  
      16, 17, 18, 16, 18, 19,
  
      20, 21, 22, 20, 22, 23,

      
      24, 25, 26, 24, 26, 27,

      28, 29, 30, 28, 30, 31,

      32, 33, 34, 32,  34, 35,

      36, 37, 38, 36, 38, 39,

      40, 41, 42, 40, 42, 43,

      44, 45, 46, 44, 46, 47,

      

      48, 49, 50, 48, 50, 51,

      52, 53, 54, 52, 54, 55,

      56, 57, 58, 56, 58, 59,

      60, 61, 62,  60, 62, 63,

      64, 65, 66, 64, 66, 67,
      
      68, 69, 70, 68, 70, 71,

      

      72, 73, 74,  72, 74, 75,

      76, 77, 78, 76, 78, 79,

      80, 81, 82, 80, 82, 83,

      84, 85, 86, 84, 86, 87,

      88, 89, 90, 88, 90, 91,

      92, 93, 94, 92, 94, 95,

      
      96, 97, 98,  96, 98, 99,

      100, 101, 102, 100, 102, 103,

      
      104, 105, 106, 104, 106, 107,

      108, 109, 110, 108, 110, 111,

      112, 113, 114, 112, 114, 115,

      116, 117, 118, 116, 118, 119,

      120, 121, 122, 120, 122, 123,

    
      124, 125, 126, 124, 126, 127,

      128, 129, 130, 128, 130, 131,

      132, 133, 134, 132, 134, 135,

      136, 137, 138, 136, 138, 139,

      140, 141, 142, 140, 142, 143,

      
      144, 145, 146, 144, 146, 147,

      148, 149, 150, 148, 150, 151,

      152, 153, 154, 152, 154, 155,

      
      156, 157, 158, 156, 158, 159,

      160, 161, 162, 160, 162, 163,

      164, 165, 166, 164, 166, 167,

      168, 169, 170, 168, 170, 171,

      172, 173, 174, 172, 174, 175,

      
      176, 177, 178, 176, 178, 179,

      180, 181, 182, 180, 182, 183,

      184, 185, 186, 184, 186, 187,

      188, 189, 190, 188, 190, 191,

      
      192,  193, 194, 192, 194, 195,

      196, 197, 198, 196, 198, 199,

      200, 201, 202, 200, 202, 203,

      204, 205, 206, 204, 206, 207,

      208, 209, 210, 208, 210, 211,

      212, 213, 214, 212, 214, 215,

      216, 217, 218, 216, 218, 219,

      220, 221, 222, 220, 222, 223,

    
      224, 225, 226, 224, 226, 227,

      228, 229, 230, 228, 230, 231,

      232, 233, 234, 232, 234, 235,

      236, 237, 238, 236, 238, 239,

      240, 241, 242, 240, 242, 243,

      244, 245, 246, 244, 246, 247,

      248, 249, 250, 248, 250, 251,

      252, 253, 254, 252, 254, 255,

      256, 257, 258, 256, 258, 259,

      260, 261, 262, 260, 262, 263,

      264, 265, 266, 264, 266, 267,

    
      268, 269, 270, 268, 270, 271,

      272, 273, 274, 272, 274, 275,

      276, 277, 278, 276, 278, 279,

      
      280, 281, 282, 280, 282, 283,

      284, 285, 286, 284, 286, 287,

      288, 289, 290, 288, 290, 291,

      292, 293, 294, 292, 294, 295,

      296, 297, 298, 296, 298, 299,

      300, 301, 302, 300, 302, 303,

    

      304, 305, 306, 304, 306, 307,

      308, 309, 310, 308, 310, 311,

      312, 313, 314, 312, 314, 315,

      316, 317, 318, 316, 318, 319,

      320, 321, 322, 320, 322, 323,

      324, 325, 326, 324, 326, 327,

    ];

    var triangle_vbo = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, triangle_vbo);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(cube), GL.STATIC_DRAW);
  
    var triangle_ebo = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, triangle_ebo);
    GL.bufferData(
      GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(cube_faces),
      GL.STATIC_DRAW
    );

    //kaki kanan
    var LEGG_RIGHT = generateCube(0.4, -0.8, 0, 0.21, 0.4, 0.21, [0.3, 0.3, 0.3]);
  
    // Create buffers for the cube
    var LEGG_RIGHT_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_RIGHT_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(LEGG_RIGHT.vertices), GL.STATIC_DRAW);
  
    var LEGG_RIGHT_COLORS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_RIGHT_COLORS);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(LEGG_RIGHT.colors), GL.STATIC_DRAW);
  
    var LEGG_RIGHT_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEGG_RIGHT_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(LEGG_RIGHT.faces), GL.STATIC_DRAW);

    //kaki kiri
    var LEGG_LEFT = generateCube(-0.4, -0.8, 0, 0.21, 0.4, 0.21, [0.3, 0.3, 0.3]);
  
    // Create buffers for the cube
    var LEGG_LEFT_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_LEFT_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(LEGG_LEFT.vertices), GL.STATIC_DRAW);
  
    var LEGG_LEFT_COLORS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_LEFT_COLORS);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(LEGG_LEFT.colors), GL.STATIC_DRAW);
  
    var LEGG_LEFT_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEGG_LEFT_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(LEGG_LEFT.faces), GL.STATIC_DRAW);

    //pistol kiri
    // Magazine
    var magLeft = generateSolidTube(
      -0.91,
      -0.3,
      0.2,
      0.1,
      0.1,
      0.5,
      30,
      [0.588, 0.294, 0]
    );
    // Create buffers
    var mag_vertex_left = createVertexBuffer(GL, magLeft.vertices);
    var mag_colors_left = createColorBuffer(GL, magLeft.colors);
    var mag_faces_left = createFacesBuffer(GL, magLeft.faces);

    //pelatuk
    var Left = generateCurvePistol(-0.9, -0.2, -0.2, 0.2, 0.1, 0.2, 30, true, [0.6, 0.6, 0.6]);
  
    var VERTEX_LEFT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX_LEFT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(Left.vertices), GL.STATIC_DRAW);
  
    var COLORS_LEFT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, COLORS_LEFT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(Left.colors), GL.STATIC_DRAW);
  
    var FACES_LEFT = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES_LEFT);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Left.faces), GL.STATIC_DRAW);
    
    //pistol kanan
    // Magazine
    var magRight = generateSolidTube(
      0.91,
      -0.3,
      0.2,
      0.1,
      0.1,
      0.5,
      30,
      [0.588, 0.294, 0]
    );
    // Create buffers
    var mag_vertex_right = createVertexBuffer(GL, magRight.vertices);
    var mag_colors_right = createColorBuffer(GL, magRight.colors);
    var mag_faces_right = createFacesBuffer(GL, magRight.faces);

    //pelatuk
    var Right = generateCurvePistol(0.9, -0.2, -0.2, 0.2, 0.1, 0.2, 30, true, [0.6, 0.6, 0.6]);
  
    var VERTEX_RIGHT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX_RIGHT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(Right.vertices), GL.STATIC_DRAW);
  
    var COLORS_RIGHT = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, COLORS_RIGHT);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(Right.colors), GL.STATIC_DRAW);

    var FACES_RIGHT = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES_RIGHT);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Right.faces), GL.STATIC_DRAW);

  /*========================================================= */
  /*====================== END KNIGHT ======================= */
  /*========================================================= */

  
    /*========================================================= */
    /*====================== ENVIROMENT ======================= */
    /*========================================================= */
  
    //Floor
    var floor = generateWorld(50, 500, 0.3, 0, 0, 0, [0.04, 0.18, 0.21]);
  
    var FLOOR_VERTEX = createVertexBuffer(GL, floor.vertices);
    var FLOOR_COLORS = createColorBuffer(GL, floor.colors);
    var FLOOR_FACES = createFacesBuffer(GL, floor.faces);
  
    // roof
    var roof = generateWorld(50, 500, 0.3, 0, 21, 0, [0.04, 0.18, 0.21]);
  
    var ROOF_VERTEX = createVertexBuffer(GL, roof.vertices);
    var ROOF_COLORS = createColorBuffer(GL, roof.colors);
    var ROOF_FACES = createFacesBuffer(GL, roof.faces);
  
    //Back
    var backWall = generateWorld(50, 0.3, 75, 0, 3, -22, [0.37, 0.46, 0.49]);
  
    var BACK_WALL_VERTEX = createVertexBuffer(GL, backWall.vertices);
    var BACK_WALL_COLORS = createColorBuffer(GL, backWall.colors);
    var BACK_WALL_FACES = createFacesBuffer(GL, backWall.faces);
  
    //Left
    var leftWall = generateWorld(60, 0.3, 80, -5, 3, -1, [0.37, 0.46, 0.49]);
  
    var LEFT_WALL_VERTEX = createVertexBuffer(GL, leftWall.vertices);
    var LEFT_WALL_COLORS = createColorBuffer(GL, leftWall.colors);
    var LEFT_WALL_FACES = createFacesBuffer(GL, leftWall.faces);
  
    //Right
    // width, length, height, x, y, z, customColor
    var rightWall = generateWorld(50, 0.3, 75, 5, 3, -1, [0.37, 0.46, 0.49]);
  
    var RIGHT_WALL_VERTEX = createVertexBuffer(GL, rightWall.vertices);
    var RIGHT_WALL_COLORS = createColorBuffer(GL, rightWall.colors);
    var RIGHT_WALL_FACES = createFacesBuffer(GL, rightWall.faces);
  
    //Left back pillar
    // x, y, z, width, height, depth, color
    var leftBackPillar = generateCube(-24.5, 3, -21, 1, 35.6, 1, [0.22, 0.44, 0.27]);
  
    var LEFT_BACK_PILLAR_VERTEX = createVertexBuffer(GL, leftBackPillar.vertices);
    var LEFT_BACK_PILLAR_COLORS = createColorBuffer(GL, leftBackPillar.colors);
    var LEFT_BACK_PILLAR_FACES = createFacesBuffer(GL, leftBackPillar.faces);
  
    //Right back pillar
    // x, y, z, width, height, depth, color
    var rightBackPillar = generateCube(24.5, 3, -21, 1, 35.6, 1, [0.22, 0.44, 0.27]);
  
    var RIGHT_BACK_PILLAR_VERTEX = createVertexBuffer(GL, rightBackPillar.vertices);
    var RIGHT_BACK_PILLAR_COLORS = createColorBuffer(GL, rightBackPillar.colors);
    var RIGHT_BACK_PILLAR_FACES = createFacesBuffer(GL, rightBackPillar.faces);
  
    //bottom back pillar
    // x, y, z, width, height, depth, color
    var bottomBackPillar = generateCube(0, 0.2, -21, 50, 2, 1, [0.22, 0.44, 0.27]);
  
    var BOTTOM_BACK_PILLAR_VERTEX = createVertexBuffer(GL, bottomBackPillar.vertices);
    var BOTTOM_BACK_PILLAR_COLORS = createColorBuffer(GL, bottomBackPillar.colors);
    var BOTTOM_BACK_PILLAR_FACES = createFacesBuffer(GL, bottomBackPillar.faces);
  
    //top back pillar
    // x, y, z, width, height, depth, color
    var topBackPillar = generateCube(0, 20.7, -21, 50, 2, 1, [0.22, 0.44, 0.27]);
  
    var TOP_BACK_PILLAR_VERTEX = createVertexBuffer(GL, topBackPillar.vertices);
    var TOP_BACK_PILLAR_COLORS = createColorBuffer(GL, topBackPillar.colors);
    var TOP_BACK_PILLAR_FACES = createFacesBuffer(GL, topBackPillar.faces);
  
    //bottom left pillar
    // x, y, z, width, height, depth, color
    var bottomLeftPillar = generateCube(-24.5, 0.2, 2, 1, 2, 50, [0.22, 0.44, 0.27]);
  
    var BOTTOM_LEFT_PILLAR_VERTEX = createVertexBuffer(GL, bottomLeftPillar.vertices);
    var BOTTOM_LEFT_PILLAR_COLORS = createColorBuffer(GL, bottomLeftPillar.colors);
    var BOTTOM_LEFT_PILLAR_FACES = createFacesBuffer(GL, bottomLeftPillar.faces);
  
    //top left pillar
    // x, y, z, width, height, depth, color
    var topLeftPillar = generateCube(-24.5, 20.7, 2, 1, 2, 50, [0.22, 0.44, 0.27]);
  
    var TOP_LEFT_PILLAR_VERTEX = createVertexBuffer(GL, topLeftPillar.vertices);
    var TOP_LEFT_PILLAR_COLORS = createColorBuffer(GL, topLeftPillar.colors);
    var TOP_LEFT_PILLAR_FACES = createFacesBuffer(GL, topLeftPillar.faces);
  
    //bottom right pillar
    // x, y, z, width, height, depth, color
    var bottomRightPillar = generateCube(24.5, 0.2, 2, 1, 2, 50, [0.22, 0.44, 0.27]);
  
    var BOTTOM_RIGHT_PILLAR_VERTEX = createVertexBuffer(GL, bottomRightPillar.vertices);
    var BOTTOM_RIGHT_PILLAR_COLORS = createColorBuffer(GL, bottomRightPillar.colors);
    var BOTTOM_RIGHT_PILLAR_FACES = createFacesBuffer(GL, bottomRightPillar.faces);
  
    //top right right pillar
    // x, y, z, width, height, depth, color
    var topRightPillar = generateCube(24.5, 20.7, 2, 1, 2, 50, [0.22, 0.44, 0.27]);
  
    var TOP_RIGHT_PILLAR_VERTEX = createVertexBuffer(GL, topRightPillar.vertices);
    var TOP_RIGHT_PILLAR_COLORS = createColorBuffer(GL, topRightPillar.colors);
    var TOP_RIGHT_PILLAR_FACES = createFacesBuffer(GL, topRightPillar.faces);

    // hiasan untuk map
    //untuk dinding depan
    var ball1 = generateSphere2(-28, 10, 15, 5, 30);

    var BALL1_VERTEX = createVertexBuffer(GL, ball1.vertices);
    var BALL1_COLORS = createColorBuffer(GL, ball1.colors);
    var BALL1_FACES = createFacesBuffer(GL, ball1.faces);

    var ball2 = generateSphere2(-28, 10, -4, 5, 30);

    var BALL2_VERTEX = createVertexBuffer(GL, ball2.vertices);
    var BALL2_COLORS = createColorBuffer(GL, ball2.colors);
    var BALL2_FACES = createFacesBuffer(GL, ball2.faces);

    // untuk dinding belakang
    var ball3 = generateSphere2(-16, 10, -24, 4, 30);

    var BALL3_VERTEX = createVertexBuffer(GL, ball3.vertices);
    var BALL3_COLORS = createColorBuffer(GL, ball3.colors);
    var BALL3_FACES = createFacesBuffer(GL, ball3.faces);

    var ball4 = generateSphere2(0, 10, -24, 4, 30);

    var BALL4_VERTEX = createVertexBuffer(GL, ball4.vertices);
    var BALL4_COLORS = createColorBuffer(GL, ball4.colors);
    var BALL4_FACES = createFacesBuffer(GL, ball4.faces);

    var ball5 = generateSphere2(16, 10, -24, 4, 30);

    var BALL5_VERTEX = createVertexBuffer(GL, ball5.vertices);
    var BALL5_COLORS = createColorBuffer(GL, ball5.colors);
    var BALL5_FACES = createFacesBuffer(GL, ball5.faces);

    //untuk dinding kanan
    var ball6 = generateSphere2(28, 10, 15, 5, 30);

    var BALL6_VERTEX = createVertexBuffer(GL, ball6.vertices);
    var BALL6_COLORS = createColorBuffer(GL, ball6.colors);
    var BALL6_FACES = createFacesBuffer(GL, ball6.faces);

    var ball7 = generateSphere2(28, 10, -4, 5, 30);

    var BALL7_VERTEX = createVertexBuffer(GL, ball7.vertices);
    var BALL7_COLORS = createColorBuffer(GL, ball7.colors);
    var BALL7_FACES = createFacesBuffer(GL, ball7.faces);
  
    //Obstacle
    // x, y, z, width, height, depth, color
    var box1 = generateCube(7, 2, 10, 4, 10, 10, [0.58, 0.42, 0.27]);
  
    var BOX1_VERTEX = createVertexBuffer(GL, box1.vertices);
    var BOX1_COLORS = createColorBuffer(GL, box1.colors);
    var BOX1_FACES = createFacesBuffer(GL, box1.faces);
  
    var box2 = generateCube(-10, 2, 22, 4, 3, 4, [0.58, 0.42, 0.27]);
  
    var BOX2_VERTEX = createVertexBuffer(GL, box2.vertices);
    var BOX2_COLORS = createColorBuffer(GL, box2.colors);
    var BOX2_FACES = createFacesBuffer(GL, box2.faces);
  
    var box3 = generateCube(-4, 2, 3, 4, 5, 4, [0.58, 0.42, 0.27]);
  
    var BOX3_VERTEX = createVertexBuffer(GL, box3.vertices);
    var BOX3_COLORS = createColorBuffer(GL, box3.colors);
    var BOX3_FACES = createFacesBuffer(GL, box3.faces);
  
    /*========================================================= */
    /*========================= MATRIX ======================== */
    /*========================================================= */
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
  
    /*========================= MATRIX ENV ========================= */
    // Floor
    var WORLD_MATRIX = LIBS.get_I4();
  
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
  
    /*========================= MATRIX ENV ========================= */
  
    /*========================= MATRIX UFO ======================== */
    var BODY_UFO_MATRIX = LIBS.get_I4();
  
    var LASER_UFO_MATRIX = LIBS.get_I4();
  
    var UFO_VIEW_MATRIX = LIBS.get_I4();
  
    //First Render of the UFO
    LIBS.translateX(UFO_VIEW_MATRIX, -21);
    LIBS.translateY(UFO_VIEW_MATRIX, -4.5);
    LIBS.translateZ(UFO_VIEW_MATRIX, -20);
  
    LIBS.rotateY(UFO_VIEW_MATRIX, 3);
    /*========================= MATRIX UFO ======================== */
  
    /*========================= MATRIX ROBOT ========================= */
    var BADAN_MATRIX = LIBS.get_I4();
  
    var KAKI_KANAN_MATRIX = LIBS.get_I4();
  
    var KAKI_KIRI_MATRIX = LIBS.get_I4();
  
    var SABER_MATRIX = LIBS.get_I4();
  
    var ROBOT_VIEW_MATRIX = LIBS.get_I4();
  
    //First Render of the ROBOT
    LIBS.translateX(ROBOT_VIEW_MATRIX, 12);
    LIBS.translateY(ROBOT_VIEW_MATRIX, 20);
    LIBS.translateZ(ROBOT_VIEW_MATRIX, -50);
  
    LIBS.rotateY(ROBOT_VIEW_MATRIX, 0);
    /*========================= MATRIX ROBOT ========================= */

    /*========================= MATRIX KNIGHT ========================= */


    var KNIGHT_MODEL_MATRIX = LIBS.get_I4();
    var KNIGHT_VIEW_MATRIX = LIBS.get_I4();

    //kaki kanan
    var LEGG_KANAN_MATRIX = LIBS.get_I4();

    //kaki kiri
    var LEGG_KIRI_MATRIX = LIBS.get_I4();

    //magazine
    var MAG_MATRIX = LIBS.get_I4();

    LIBS.translateX(KNIGHT_VIEW_MATRIX, -11);
    LIBS.translateY(KNIGHT_VIEW_MATRIX, -4.5);
    LIBS.translateZ(KNIGHT_VIEW_MATRIX, 10);
    
    LIBS.rotateY(KNIGHT_VIEW_MATRIX, 0);
    /*========================= MATRIX KNIGHT ========================= */
  
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
  
    var flyingUFO1 = 0;
    var flyingUFO2 = 0;
    var flyingUFO3 = 0;
    var flyingUFO4 = 0;
    var flyingUFO5 = 0;
    var flyingUFO6 = 0;
    var flyingUFO7 = 0;
    var flyingUFO8 = 0;
    var flyingUFO9 = 0;
    var flyingUFO10 = 0;
    var flyingUFO11 = 0;
    var flyingUFO12 = 0;
    
    var isFinishedMoving = false;
  
    // FOR ROBOT
    var then = 0;
  
    var KakiKananTime = 0;
    var KakiKananReverse = false;
  
    var KakiKiriTime = 0;
    var KakiKiriReverse = false;
  
    var SaberTime = 0;
    var SaberReverse = false;
  
    var runningRobot0 = 0;
    var runningRobot1 = 0;
    var runningRobot2 = 0;
    var runningRobot3 = 0;
    var runningRobot4 = 0;
    var runningRobot5 = 0;
    var runningRobot6 = 0;
    var runningRobot7 = 0;
    var runningRobot8 = 0;


    //FOR KNIGHT
    var LEGGKananTime = 0;
    var LEGGKananReverse = false;
  
    var LEGGKiriTime = 0;
    var LEGGKiriReverse = false;

    var MagTime = 0;
    var MagReverse = false;

    var runningKnight0 = 0;
    var runningKnight1 = 0;
    var runningKnight2 = 0;
    var runningKnight3 = 0;
    var runningKnight4 = 0;
    var runningKnight5 = 0;
    var runningKnight6 = 0;
    var runningKnight7 = 0;
    var runningKnight8 = 0;
    var runningKnight9 = 0;
    var runningKnight10 = 0;
    var runningKnight11 = 0;
    var runningKnight12 = 0;
    var runningKnight13 = 0;
    var runningKnight14 = 0;
    var runningKnight15 = 0;
    var runningKnight16 = 0;
  
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
      // UFO floating Animation
      BODY_UFO_MATRIX = LIBS.get_I4();
  
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
  
      LIBS.translateY(BODY_UFO_MATRIX, KF_UFO_Body);
      LIBS.rotateY(BODY_UFO_MATRIX, theta);
      //LIBS.rotateX(BODY_UFO_MATRIX, alpha);
  
      // Laser shooting animation
      LASER_UFO_MATRIX = LIBS.get_I4();
  
      var KF_Laser = 0;
  
      if (time < 60) {
        if (isMovingForward && LaserTime >= endLaserTime) {
          // If moving forward and reached the finish point, reset to start point
          startLaserTime = 0;
          LaserTime = startLaserTime;
          targetProgress = finishProgress;
        } else if (!isMovingForward && LaserTime <= startLaserTime) {
          // If moving backward and reached the start point, reset to start point
          LaserTime = startLaserTime;
          targetProgress = finishProgress;
        }
  
        if (isMovingForward) {
          LaserTime += deltaTime;
        } else {
          LaserTime -= deltaTime;
        }
  
        var progress = (LaserTime - startLaserTime) / (endLaserTime - startLaserTime);
  
        // Smoothly interpolate between start and finish progress
        var currentProgress = startProgress + (targetProgress - startProgress) * progress;
  
        KF_Laser = currentProgress * 10; //dikali berapa untuk jarak laser
      }
  
      //LIBS.translateX(LASER_UFO_MATRIX, KF_Laser)
      //LIBS.translateY(LASER_UFO_MATRIX, KF_Laser);
      LIBS.translateZ(LASER_UFO_MATRIX, KF_Laser);
  
      //LIBS.rotateY(LASER_UFO_MATRIX, theta);
      //LIBS.rotateX(LASER_UFO_MATRIX, alpha);
  
      /*========================= UFO TIME AND ANIMATION  ========================= */
  
      /*========================= ROBOT TIME AND ANIMATION  ========================= */
      // Badan
      BADAN_MATRIX = LIBS.get_I4();
  
      // Kaki Kanan
      KAKI_KANAN_MATRIX = LIBS.get_I4();
      var KF_KakiKanan = 0;
  
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
  
      // Kaki Kiri
      KAKI_KIRI_MATRIX = LIBS.get_I4();
      var KF_KakiKiri = 0;
  
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
  
      SABER_MATRIX = LIBS.get_I4();
      var KF_Saber = 0;
  
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
  
      /*========================= KNIGHT TIME AND ANIMATION  ========================= */
      KNIGHT_MODEL_MATRIX = LIBS.get_I4();
      // Kaki Kanan
      LEGG_KANAN_MATRIX = LIBS.get_I4();
      var KF_LEGGKanan = 0;
  
      
        if (LEGGKananTime <= -10) {
          LEGGKananReverse = true;
        } else if (LEGGKananTime >= 10) {
          LEGGKananReverse = false;
        }
  
        if (LEGGKananReverse) {
          LEGGKananTime += deltaTime;
        } else {
          LEGGKananTime -= deltaTime;
        }
  
        KF_LEGGKanan = LIBS.degToRad(LEGGKananTime);
      
  
      // Kaki Kiri
      LEGG_KIRI_MATRIX = LIBS.get_I4();
      var KF_LEGGKiri = 0;
  
      
        if (LEGGKiriTime <= -10) {
          LEGGKiriReverse = false;
        } else if (LEGGKiriTime >= 10) {
          LEGGKiriReverse = true;
        }
  
        if (LEGGKiriReverse) {
          LEGGKiriTime -= deltaTime;
        } else {
          LEGGKiriTime += deltaTime;
        }
  
        KF_LEGGKiri = LIBS.degToRad(LEGGKiriTime);

        LIBS.rotateY(KNIGHT_MODEL_MATRIX, theta);
        LIBS.rotateX(KNIGHT_MODEL_MATRIX, alpha);

      // Magazine
      MAG_MATRIX = LIBS.get_I4();
  
      var KF_Mag = 0;
  
      if (time < 10) {
        if (MagTime <= -10) {
          MagReverse = true;
        } else if (MagTime >= 10) {
          MagReverse = false;
        }
  
        if (MagReverse) {
          MagTime += deltaTime;
        } else {
          MagTime -= deltaTime;
        }
  
        KF_Mag = LIBS.degToRad(MagTime);
        KF_Mag *= 0.3;
      }
      /*========================= ANIMATION  ========================= */
      // KAKI KANAN
      LIBS.rotateX(LEGG_KANAN_MATRIX, KF_LEGGKanan);
      LIBS.rotateY(LEGG_KANAN_MATRIX, theta);
      LIBS.rotateX(LEGG_KANAN_MATRIX, alpha);
  
      // KAKI KIRI
      LIBS.rotateX(LEGG_KIRI_MATRIX, KF_LEGGKiri);
      LIBS.rotateY(LEGG_KIRI_MATRIX, theta);
      LIBS.rotateX(LEGG_KIRI_MATRIX, alpha);

      //MAGAZINE
      LIBS.translateY(MAG_MATRIX, KF_Mag);
      LIBS.rotateY(MAG_MATRIX, theta);

      /*========================= KNIGHT TIME AND ANIMATION  ========================= */

      /*========================= WORLD ANIMATION ========================= */
      WORLD_MATRIX = LIBS.get_I4();
      //LIBS.rotateY(WORLD_MATRIX, theta);
      //LIBS.rotateY(WALL1_MATRIX, theta);
  
      /*========================= WORLD ANIMATION ========================= */
  
      /*========================= SCENE ANIMATION ========================= */
  
      // robot walking
      if (time < 1) {
        runningRobot8 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
      } else if (time > 1 && time < 3) {
        runningRobot0 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
      } else if (time > 3 && time < 4.3) {
        runningRobot1 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot1);
        LIBS.translateZ(SABER_MATRIX, runningRobot1);
      } else if (time > 4.3 && time < 5.6) {
        runningRobot2 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot1);
        LIBS.translateZ(SABER_MATRIX, runningRobot1);
  
        LIBS.translateX(BADAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KANAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KIRI_MATRIX, -runningRobot2);
        LIBS.translateX(SABER_MATRIX, -runningRobot2);
      } else if (time > 5.6 && time < 7.3) {
        runningRobot3 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot1);
        LIBS.translateZ(SABER_MATRIX, runningRobot1);
  
        LIBS.translateX(BADAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KANAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KIRI_MATRIX, -runningRobot2);
        LIBS.translateX(SABER_MATRIX, -runningRobot2);
  
        LIBS.translateZ(BADAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KANAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KIRI_MATRIX, -runningRobot3);
        LIBS.translateZ(SABER_MATRIX, -runningRobot3);
      } else if (time > 7.3 && time < 8.6) {
        runningRobot4 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot1);
        LIBS.translateZ(SABER_MATRIX, runningRobot1);
  
        LIBS.translateX(BADAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KANAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KIRI_MATRIX, -runningRobot2);
        LIBS.translateX(SABER_MATRIX, -runningRobot2);
  
        LIBS.translateZ(BADAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KANAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KIRI_MATRIX, -runningRobot3);
        LIBS.translateZ(SABER_MATRIX, -runningRobot3);
  
        LIBS.translateX(BADAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KANAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KIRI_MATRIX, runningRobot4);
        LIBS.translateX(SABER_MATRIX, runningRobot4);
      } else if (time > 8.6 && time < 13) {
        runningRobot5 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot1);
        LIBS.translateZ(SABER_MATRIX, runningRobot1);
  
        LIBS.translateX(BADAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KANAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KIRI_MATRIX, -runningRobot2);
        LIBS.translateX(SABER_MATRIX, -runningRobot2);
  
        LIBS.translateZ(BADAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KANAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KIRI_MATRIX, -runningRobot3);
        LIBS.translateZ(SABER_MATRIX, -runningRobot3);
  
        LIBS.translateX(BADAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KANAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KIRI_MATRIX, runningRobot4);
        LIBS.translateX(SABER_MATRIX, runningRobot4);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot5);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot5);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot5);
        LIBS.translateZ(SABER_MATRIX, runningRobot5);
      } else if (time > 13 && time < 16) {
        runningRobot6 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot1);
        LIBS.translateZ(SABER_MATRIX, runningRobot1);
  
        LIBS.translateX(BADAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KANAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KIRI_MATRIX, -runningRobot2);
        LIBS.translateX(SABER_MATRIX, -runningRobot2);
  
        LIBS.translateZ(BADAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KANAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KIRI_MATRIX, -runningRobot3);
        LIBS.translateZ(SABER_MATRIX, -runningRobot3);
  
        LIBS.translateX(BADAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KANAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KIRI_MATRIX, runningRobot4);
        LIBS.translateX(SABER_MATRIX, runningRobot4);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot5);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot5);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot5);
        LIBS.translateZ(SABER_MATRIX, runningRobot5);
  
        LIBS.translateZ(BADAN_MATRIX, -runningRobot6);
        LIBS.translateZ(KAKI_KANAN_MATRIX, -runningRobot6);
        LIBS.translateZ(KAKI_KIRI_MATRIX, -runningRobot6);
        LIBS.translateZ(SABER_MATRIX, -runningRobot6);
      } else if (time > 16) {
        runningRobot7 += deltaTime * 0.2;
  
        LIBS.translateY(BADAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KANAN_MATRIX, -runningRobot8);
        LIBS.translateY(KAKI_KIRI_MATRIX, -runningRobot8);
        LIBS.translateY(SABER_MATRIX, -runningRobot8);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot0);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot0);
        LIBS.rotateY(SABER_MATRIX, -runningRobot0);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot1);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot1);
        LIBS.translateZ(SABER_MATRIX, runningRobot1);
  
        LIBS.translateX(BADAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KANAN_MATRIX, -runningRobot2);
        LIBS.translateX(KAKI_KIRI_MATRIX, -runningRobot2);
        LIBS.translateX(SABER_MATRIX, -runningRobot2);
  
        LIBS.translateZ(BADAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KANAN_MATRIX, -runningRobot3);
        LIBS.translateZ(KAKI_KIRI_MATRIX, -runningRobot3);
        LIBS.translateZ(SABER_MATRIX, -runningRobot3);
  
        LIBS.translateX(BADAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KANAN_MATRIX, runningRobot4);
        LIBS.translateX(KAKI_KIRI_MATRIX, runningRobot4);
        LIBS.translateX(SABER_MATRIX, runningRobot4);
  
        LIBS.translateZ(BADAN_MATRIX, runningRobot5);
        LIBS.translateZ(KAKI_KANAN_MATRIX, runningRobot5);
        LIBS.translateZ(KAKI_KIRI_MATRIX, runningRobot5);
        LIBS.translateZ(SABER_MATRIX, runningRobot5);
  
        LIBS.translateZ(BADAN_MATRIX, -runningRobot6);
        LIBS.translateZ(KAKI_KANAN_MATRIX, -runningRobot6);
        LIBS.translateZ(KAKI_KIRI_MATRIX, -runningRobot6);
        LIBS.translateZ(SABER_MATRIX, -runningRobot6);
  
        LIBS.rotateY(BADAN_MATRIX, -runningRobot7);
        LIBS.rotateY(KAKI_KANAN_MATRIX, -runningRobot7);
        LIBS.rotateY(KAKI_KIRI_MATRIX, -runningRobot7);
        LIBS.rotateY(SABER_MATRIX, -runningRobot7);
      }
  
      // robot rotating
      if (time > 3 && time < 4.3) {
        LIBS.rotateAroundY(BADAN_MATRIX, -180, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KANAN_MATRIX, -180, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KIRI_MATRIX, -180, 0, 0, 0);
        LIBS.rotateAroundY(SABER_MATRIX, -180, 0, 0, 0);
      } else if (time > 4.3 && time < 5.6) {
        LIBS.rotateAroundY(BADAN_MATRIX, 95, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KANAN_MATRIX, 95, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KIRI_MATRIX, 95, 0, 0, 0);
        LIBS.rotateAroundY(SABER_MATRIX, 95, 0, 0, 0);
      } else if (time > 5.6 && time < 7.3) {
        LIBS.rotateAroundY(BADAN_MATRIX, 100, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KANAN_MATRIX, 100, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KIRI_MATRIX, 100, 0, 0, 0);
        LIBS.rotateAroundY(SABER_MATRIX, 100, 0, 0, 0);
      } else if (time > 7.3 && time < 8.6) {
        LIBS.rotateAroundY(BADAN_MATRIX, 60, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KANAN_MATRIX, 60, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KIRI_MATRIX, 60, 0, 0, 0);
        LIBS.rotateAroundY(SABER_MATRIX, 60, 0, 0, 0);
      } else if (time > 8.6 && time < 13) {
        LIBS.rotateAroundY(BADAN_MATRIX, -180, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KANAN_MATRIX, -180, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KIRI_MATRIX, -180, 0, 0, 0);
        LIBS.rotateAroundY(SABER_MATRIX, -180, 0, 0, 0);
      } else if (time > 13) {
        LIBS.rotateAroundY(BADAN_MATRIX, 100, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KANAN_MATRIX, 100, 0, 0, 0);
        LIBS.rotateAroundY(KAKI_KIRI_MATRIX, 100, 0, 0, 0);
        LIBS.rotateAroundY(SABER_MATRIX, 100, 0, 0, 0);
      }
      // end robot walking
  
      // start ufo flying
      //UFO ANIMATION
      if (time > 0.8 && time < 3) {
        flyingUFO1 += deltaTime * 0.2;
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);

        isFinishedMoving = false;
      
      } else if (time > 3 && time < 3.83) {
        flyingUFO2 += deltaTime * 0.2;
        
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);

        isFinishedMoving = false;
  
      } else if (time > 3.83 && time < 4.7) {
        flyingUFO3 += deltaTime * 0.2;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);

        isFinishedMoving = false;
  
      } else if (time > 4.7 && time < 5.5) {
        flyingUFO4 += deltaTime * 0.2;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);

        isFinishedMoving = false;
      } else if (time > 5.5 && time < 7) {
        flyingUFO5 += deltaTime * 0.2;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO5);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO5);

      } else if (time > 7 && time < 8.5) {
        flyingUFO6 += deltaTime * 0.2;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO5);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO5);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO6);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO6);

      } else if (time > 8.5 && time < 10) {
        flyingUFO7 += deltaTime * 0.2;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO5);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO5);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO6);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO6);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO7);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO7);

      
      } else if (time > 10 && time < 11.7) {
        flyingUFO8 += deltaTime * 0.2;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO5);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO5);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO6);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO6);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO7);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO7);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO8);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO8);

      } else if (time > 11.7 && time < 13) {
        flyingUFO9 += deltaTime * 0.025;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO5);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO5);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO6);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO6);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO7);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO7);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO8);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO8);
  
        LIBS.rotateY(BODY_UFO_MATRIX, flyingUFO9);
        LIBS.rotateY(LASER_UFO_MATRIX, flyingUFO9);
 
        //Laser untuk menembak
        // Gambar left laser
        GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_vertex);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_colors);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLaserShoot_faces);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
    
        GL.drawElements(GL.TRIANGLE_STRIP, leftLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);
    
        // Gambar right laser
        GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_vertex);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_colors);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaserShoot_faces);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
    
        GL.drawElements(GL.TRIANGLE_STRIP, rightLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);

      } else if (time > 13 && time < 16) {
        flyingUFO10 += deltaTime * 0.025;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO5);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO5);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO6);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO6);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO7);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO7);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO8);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO8);
  
        LIBS.rotateY(BODY_UFO_MATRIX, flyingUFO9);
        LIBS.rotateY(LASER_UFO_MATRIX, flyingUFO9);

        LIBS.rotateY(BODY_UFO_MATRIX, -flyingUFO10);
        LIBS.rotateY(LASER_UFO_MATRIX, -flyingUFO10);
 
        //Laser untuk menembak
        // Gambar left laser
        GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_vertex);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_colors);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLaserShoot_faces);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
    
        GL.drawElements(GL.TRIANGLE_STRIP, leftLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);
    
        // Gambar right laser
        GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_vertex);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_colors);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaserShoot_faces);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
    
        GL.drawElements(GL.TRIANGLE_STRIP, rightLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);

      } else if (time > 16) {
        flyingUFO11 += deltaTime * 0.025;
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO1);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO1);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO2);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO2);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO3);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO3);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO4);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO4);
  
        LIBS.translateX(BODY_UFO_MATRIX, -flyingUFO5);
        LIBS.translateX(LASER_UFO_MATRIX, -flyingUFO5);
  
        LIBS.translateZ(BODY_UFO_MATRIX, -flyingUFO6);
        LIBS.translateZ(LASER_UFO_MATRIX, -flyingUFO6);
  
        LIBS.translateX(BODY_UFO_MATRIX, flyingUFO7);
        LIBS.translateX(LASER_UFO_MATRIX, flyingUFO7);
  
        LIBS.translateZ(BODY_UFO_MATRIX, flyingUFO8);
        LIBS.translateZ(LASER_UFO_MATRIX, flyingUFO8);
  
        LIBS.rotateY(BODY_UFO_MATRIX, flyingUFO9);
        LIBS.rotateY(LASER_UFO_MATRIX, flyingUFO9);

        LIBS.rotateY(BODY_UFO_MATRIX, -flyingUFO10);
        LIBS.rotateY(LASER_UFO_MATRIX, -flyingUFO10);

        LIBS.rotateY(BODY_UFO_MATRIX, flyingUFO11);
        LIBS.rotateY(LASER_UFO_MATRIX, flyingUFO11);
 
        //Laser untuk menembak
        // Gambar left laser
        GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_vertex);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_colors);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLaserShoot_faces);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
    
        GL.drawElements(GL.TRIANGLE_STRIP, leftLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);
    
        // Gambar right laser
        GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_vertex);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_colors);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
    
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaserShoot_faces);
    
        GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
        GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
        GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
    
        GL.drawElements(GL.TRIANGLE_STRIP, rightLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);

      } 
      
  
      //UFO POV
      if (time > 0.8 && time < 3) {
        //normal
      } else if (time > 3 && time < 3.83) {
        LIBS.rotateAroundY(BODY_UFO_MATRIX, 80, 0, 0, 0)
        LIBS.rotateAroundY(LASER_UFO_MATRIX, 80, 0, 0, 0)
  
      } else if (time > 3.83 && time < 4.7) {
        LIBS.rotateAroundY(BODY_UFO_MATRIX, -60, 0, 0, 0)
        LIBS.rotateAroundY(LASER_UFO_MATRIX, -60, 0, 0, 0)
  
      } else if (time > 4.7 && time < 5.5) {
        LIBS.rotateAroundY(BODY_UFO_MATRIX, 70, 0, 0, 0)
        LIBS.rotateAroundY(LASER_UFO_MATRIX, 70, 0, 0, 0)
      } else if (time > 5.5 && time < 7) {
        LIBS.rotateAroundY(BODY_UFO_MATRIX, 80, 0, 0, 0)
        LIBS.rotateAroundY(LASER_UFO_MATRIX, 80, 0, 0, 0)
  
      } else if (time > 7 && time < 8.5) {
        LIBS.rotateAroundY(BODY_UFO_MATRIX, -160, 0, 0, 0)
        LIBS.rotateAroundY(LASER_UFO_MATRIX, -160, 0, 0, 0)
  
      } else if (time > 8.5 && time < 10) {
        LIBS.rotateAroundY(BODY_UFO_MATRIX, 89.5, 0, 0, 0)
        LIBS.rotateAroundY(LASER_UFO_MATRIX, 89.5, 0, 0, 0)
      }
      // End UFO animation

      //Start Knight Animation
      if (time > 0.8 && time < 2.5) {
        runningKnight0 += deltaTime * 0.2;
        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
      
      } else if (time > 2.5 && time < 2.7) {
        runningKnight1 += deltaTime * 0.2;
        
        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);
  
  
      } else if (time > 2.7 && time < 3.4) {
        runningKnight2 += deltaTime * 0.2;
  
        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);
  
  
      } else if (time > 3.4 && time < 4.2) {
        runningKnight3 += deltaTime * 0.2;

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);
        
      } else if (time > 4.2 && time < 4.7) {
        runningKnight4+= deltaTime * 0.2;

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);
        
      } else if (time > 4.7 && time < 5.1) {
        runningKnight5 += deltaTime * 0.2;
  
        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        
        
        
      } else if (time > 5.1 && time < 5.5) {
        runningKnight6 += deltaTime * 0.2

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

      }

      else if (time > 5.5 && time < 6) {
        runningKnight7 += deltaTime * 0.2

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);




      }else if (time > 6 && time < 6.6) {
        runningKnight8 += deltaTime * 0.2

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);


      }else if (time > 6.6 && time < 8.3) {
        runningKnight9 += deltaTime * 0.1

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

   
      }

      else if (time > 8.3 && time < 9) {
        runningKnight10 += deltaTime * 0.1

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight10);
        LIBS.translateX(MAG_MATRIX, runningKnight10);


   
      }else if (time > 9 && time < 9.5) {
        runningKnight11 += deltaTime * 0.1

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight10);
        LIBS.translateX(MAG_MATRIX, runningKnight10);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight11);
        LIBS.translateZ(MAG_MATRIX, runningKnight11);

      }else if (time > 9.5 && time < 9.9) {
        runningKnight12 += deltaTime * 0.1

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight10);
        LIBS.translateX(MAG_MATRIX, runningKnight10);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight11);
        LIBS.translateZ(MAG_MATRIX, runningKnight11);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateX(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateZ(MAG_MATRIX, runningKnight12);

      }else if (time > 9.9 && time < 10.4) {
        runningKnight13 += deltaTime * 0.1

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight10);
        LIBS.translateX(MAG_MATRIX, runningKnight10);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight11);
        LIBS.translateZ(MAG_MATRIX, runningKnight11);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateX(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateZ(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight13);
        LIBS.translateZ(MAG_MATRIX, runningKnight13);


      }else if (time > 10.4 && time < 13) {
        runningKnight14 += deltaTime * 0.04

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight10);
        LIBS.translateX(MAG_MATRIX, runningKnight10);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight11);
        LIBS.translateZ(MAG_MATRIX, runningKnight11);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateX(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateZ(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight13);
        LIBS.translateZ(MAG_MATRIX, runningKnight13);

        LIBS.rotateY(KNIGHT_MODEL_MATRIX, runningKnight14);
        LIBS.rotateY(LEGG_KANAN_MATRIX, runningKnight14);
        LIBS.rotateY(LEGG_KIRI_MATRIX, runningKnight14);
        LIBS.rotateY(MAG_MATRIX, runningKnight14);
      } if (time > 13 && time < 16) {
        runningKnight15 += deltaTime * 0.04

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight10);
        LIBS.translateX(MAG_MATRIX, runningKnight10);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight11);
        LIBS.translateZ(MAG_MATRIX, runningKnight11);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateX(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateZ(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight13);
        LIBS.translateZ(MAG_MATRIX, runningKnight13);

        LIBS.rotateY(KNIGHT_MODEL_MATRIX, runningKnight14);
        LIBS.rotateY(LEGG_KANAN_MATRIX, runningKnight14);
        LIBS.rotateY(LEGG_KIRI_MATRIX, runningKnight14);
        LIBS.rotateY(MAG_MATRIX, runningKnight14);

        LIBS.rotateY(KNIGHT_MODEL_MATRIX, -runningKnight15);
        LIBS.rotateY(LEGG_KANAN_MATRIX, -runningKnight15);
        LIBS.rotateY(LEGG_KIRI_MATRIX, -runningKnight15);
        LIBS.rotateY(MAG_MATRIX, -runningKnight15);
      } if (time > 16) {
        runningKnight16 += deltaTime * 0.04

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight0);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight0);
        LIBS.translateZ(MAG_MATRIX, -runningKnight0);
  
        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateX(MAG_MATRIX, runningKnight1);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight1);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight1);
        LIBS.translateZ(MAG_MATRIX, runningKnight1);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight2);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight2);
        LIBS.translateX(MAG_MATRIX, runningKnight2);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateX(LEGG_KIRI_MATRIX,-runningKnight3);
        LIBS.translateX(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight3);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight3);
        LIBS.translateZ(MAG_MATRIX, -runningKnight3);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight4);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight4);
        LIBS.translateZ(MAG_MATRIX, -runningKnight4);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight5);
        LIBS.translateZ(LEGG_KIRI_MATRIX,runningKnight5);
        LIBS.translateZ(MAG_MATRIX, runningKnight5);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateX(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight6);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight6);
        LIBS.translateZ(MAG_MATRIX, runningKnight6);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight7);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight7);
        LIBS.translateZ(MAG_MATRIX, runningKnight7);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KANAN_MATRIX, -runningKnight8);
        LIBS.translateX(LEGG_KIRI_MATRIX, -runningKnight8);
        LIBS.translateX(MAG_MATRIX, -runningKnight8);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KANAN_MATRIX, -runningKnight9);
        LIBS.translateZ(LEGG_KIRI_MATRIX, -runningKnight9);
        LIBS.translateZ(MAG_MATRIX, -runningKnight9);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight10);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight10);
        LIBS.translateX(MAG_MATRIX, runningKnight10);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight11);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight11);
        LIBS.translateZ(MAG_MATRIX, runningKnight11);

        LIBS.translateX(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateX(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateX(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight12);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight12);
        LIBS.translateZ(MAG_MATRIX, runningKnight12);

        LIBS.translateZ(KNIGHT_MODEL_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KANAN_MATRIX, runningKnight13);
        LIBS.translateZ(LEGG_KIRI_MATRIX, runningKnight13);
        LIBS.translateZ(MAG_MATRIX, runningKnight13);

        LIBS.rotateY(KNIGHT_MODEL_MATRIX, runningKnight14);
        LIBS.rotateY(LEGG_KANAN_MATRIX, runningKnight14);
        LIBS.rotateY(LEGG_KIRI_MATRIX, runningKnight14);
        LIBS.rotateY(MAG_MATRIX, runningKnight14);

        LIBS.rotateY(KNIGHT_MODEL_MATRIX, -runningKnight15);
        LIBS.rotateY(LEGG_KANAN_MATRIX, -runningKnight15);
        LIBS.rotateY(LEGG_KIRI_MATRIX, -runningKnight15);
        LIBS.rotateY(MAG_MATRIX, -runningKnight15);
      
        LIBS.rotateY(KNIGHT_MODEL_MATRIX, runningKnight16);
        LIBS.rotateY(LEGG_KANAN_MATRIX, runningKnight16);
        LIBS.rotateY(LEGG_KIRI_MATRIX, runningKnight16);
        LIBS.rotateY(MAG_MATRIX, runningKnight16);
      }


  
      //Knight POV
      if (time > 0.8 && time < 2.5) {
        //normal
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -60, 0, 0, 0);
      } else if (time > 2.5 && time < 2.7) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -60, 0, 0, 0);
  
      } else if (time > 2.7 && time < 3.4) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -80, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -80, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -80, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -80, 0, 0, 0);
  
      } else if (time > 3.4 && time < 4.2) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -65, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -65, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -65, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -65, 0, 0, 0);
      } else if (time > 4.2 && time < 4.7) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -60, 0, 0, 0);
  
      } else if (time > 4.7 && time < 5.1) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, 0, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, 0, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, 0, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, 0, 0, 0, 0);
  
      } else if (time > 5.1 && time < 5.5) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, 20, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, 20, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, 20, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, 20, 0, 0, 0);
      } else if (time > 6 && time < 6.6) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -90, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -90, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -90, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -90, 0, 0, 0);
      } else if (time > 6.6 && time < 8.3) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -60, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -60, 0, 0, 0);
      } else if (time > 8.3 && time < 9) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, -80, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, -80, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, -80, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, -80, 0, 0, 0);
      } else if (time > 9 && time < 9.5) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, 0, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, 0, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, 0, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, 0, 0, 0, 0);
      }else if (time > 9.5 && time < 9.9) {
        LIBS.rotateAroundY(KNIGHT_MODEL_MATRIX, 20, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KANAN_MATRIX, 20, 0, 0, 0);
        LIBS.rotateAroundY(LEGG_KIRI_MATRIX, 20, 0, 0, 0);
        LIBS.rotateAroundY(MAG_MATRIX, 20, 0, 0, 0);
      }
      //End Knight Animation

      /*========================= SCENE ANIMATION ========================= */
  
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
  
      // Roof
      GL.bindBuffer(GL.ARRAY_BUFFER, ROOF_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, ROOF_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ROOF_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, roof.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Back Wall
      GL.bindBuffer(GL.ARRAY_BUFFER, BACK_WALL_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BACK_WALL_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BACK_WALL_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, backWall.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Left Wall
      GL.bindBuffer(GL.ARRAY_BUFFER, LEFT_WALL_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEFT_WALL_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEFT_WALL_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, LEFT_WALL_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, leftWall.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Right Wall
      GL.bindBuffer(GL.ARRAY_BUFFER, RIGHT_WALL_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, RIGHT_WALL_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RIGHT_WALL_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, RIGHT_WALL_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, rightWall.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // LEFT back Pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, LEFT_BACK_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEFT_BACK_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEFT_BACK_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, leftBackPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // RIGHT back pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, RIGHT_BACK_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, RIGHT_BACK_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, RIGHT_BACK_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, rightBackPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // top back Pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, TOP_BACK_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOP_BACK_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOP_BACK_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, topBackPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // bottom back pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BACK_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_BACK_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_BACK_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, bottomBackPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // bottom left Pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_LEFT_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_LEFT_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_LEFT_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, bottomLeftPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // top left Pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, TOP_LEFT_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOP_LEFT_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOP_LEFT_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, topLeftPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // bottom right pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_RIGHT_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BOTTOM_RIGHT_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOTTOM_RIGHT_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, bottomRightPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // top right pillar
      GL.bindBuffer(GL.ARRAY_BUFFER, TOP_RIGHT_PILLAR_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, TOP_RIGHT_PILLAR_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TOP_RIGHT_PILLAR_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, topRightPillar.faces.length, GL.UNSIGNED_SHORT, 0);
  
      //Ball1
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL1_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL1_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BALL1_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ball1.faces.length, GL.UNSIGNED_SHORT, 0);

      // Ball2
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL2_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL2_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BALL2_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ball2.faces.length, GL.UNSIGNED_SHORT, 0);

      //ball 3
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL3_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL3_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BALL3_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ball3.faces.length, GL.UNSIGNED_SHORT, 0);

      //ball 4
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL4_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL4_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BALL4_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ball4.faces.length, GL.UNSIGNED_SHORT, 0);

      //ball 5
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL5_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL5_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BALL5_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ball5.faces.length, GL.UNSIGNED_SHORT, 0);

      //Ball 6
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL6_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL6_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BALL6_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ball6.faces.length, GL.UNSIGNED_SHORT, 0);

      // Ball 7
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL7_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BALL7_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BALL7_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ball7.faces.length, GL.UNSIGNED_SHORT, 0);


      //======================World Obstacle=================
      // Box1
      GL.bindBuffer(GL.ARRAY_BUFFER, BOX1_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BOX1_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOX1_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, box1.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Box2
      GL.bindBuffer(GL.ARRAY_BUFFER, BOX2_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BOX2_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOX2_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, box2.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Box3
      GL.bindBuffer(GL.ARRAY_BUFFER, BOX3_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, BOX3_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, BOX3_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, WORLD_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, box3.faces.length, GL.UNSIGNED_SHORT, 0);
  

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
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, kepala1.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // kepala2
      GL.bindBuffer(GL.ARRAY_BUFFER, kepala2_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, kepala2_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, kepala2_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, kepala2.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // badan 1
      GL.bindBuffer(GL.ARRAY_BUFFER, badan1_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, badan1_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, badan1_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, badan1.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // badan 2
      GL.bindBuffer(GL.ARRAY_BUFFER, badan2_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, badan2_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, badan2_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, badan2.faces.length, GL.UNSIGNED_SHORT, 0);
  
      //gambar ufo1
      GL.bindBuffer(GL.ARRAY_BUFFER, ufo1_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, ufo1_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ufo1_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, ufo1.faces.length, GL.UNSIGNED_SHORT, 0);
  
      //gambar ufo2
      GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, ufo2_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ufo2_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, ufo2.faces.length, GL.UNSIGNED_SHORT, 0);
  
      //Bot UFO
      GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, botUFO_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, botUFO_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, botUFO.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Draw bagian top backpack
      GL.bindBuffer(GL.ARRAY_BUFFER, topBackpack_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, topBackpack_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, topBackpack_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, topBackpack.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Draw backpack body
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, backpack.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Draw aksesoris backpack 2
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack2_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack2_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack2_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, backpack2.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Draw aksesoris backpack 3
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack3_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack3_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack3_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, backpack3.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Draw aksesoris backpack 4
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack4_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, backpack4_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, backpack4_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, backpack4.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Draw bagian bottom backpack
      GL.bindBuffer(GL.ARRAY_BUFFER, bottomBackpack_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, bottomBackpack_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bottomBackpack_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, bottomBackpack.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Gambar LeftWeapon
      GL.bindBuffer(GL.ARRAY_BUFFER, leftWeapon_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, leftWeapon_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftWeapon_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, leftWeapon.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Gambar RightWeapon
      GL.bindBuffer(GL.ARRAY_BUFFER, rightWeapon_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, rightWeapon_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightWeapon_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
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
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, leftLaser.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // Gambar right laser
      GL.bindBuffer(GL.ARRAY_BUFFER, rightLaser_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, rightLaser_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaser_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, BODY_UFO_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_STRIP, rightLaser.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // //Laser untuk menembak
      // // Gambar left laser
      // GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_vertex);
      // GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      // GL.bindBuffer(GL.ARRAY_BUFFER, leftLaserShoot_colors);
      // GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, leftLaserShoot_faces);
  
      // GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      // GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      // GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
  
      // GL.drawElements(GL.TRIANGLE_STRIP, leftLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);
  
      // // Gambar right laser
      // GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_vertex);
      // GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      // GL.bindBuffer(GL.ARRAY_BUFFER, rightLaserShoot_colors);
      // GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, rightLaserShoot_faces);
  
      // GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      // GL.uniformMatrix4fv(_VMatrix, false, UFO_VIEW_MATRIX);
      // GL.uniformMatrix4fv(_MMatrix, false, LASER_UFO_MATRIX);
  
      // GL.drawElements(GL.TRIANGLE_STRIP, rightLaserShoot.faces.length, GL.UNSIGNED_SHORT, 0);
  
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


      /*================================================================= */
      /*=========================== DRAW KNIGHT ========================== */
      /*================================================================= */
      //Badan
      GL.bindBuffer(GL.ARRAY_BUFFER, triangle_vbo);
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, triangle_ebo);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 6 * 4, 0);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 6 * 4, 3 * 4);

      
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, KNIGHT_MODEL_MATRIX);
      
      
      GL.drawElements(GL.TRIANGLES, cube_faces.length, GL.UNSIGNED_SHORT, 0);

      //kaki kanan
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_RIGHT_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_RIGHT_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEGG_RIGHT_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, LEGG_KANAN_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, LEGG_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

      //kaki kiri
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_LEFT_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_LEFT_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEGG_LEFT_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, LEGG_KIRI_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, LEGG_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);
      
      // Pistol kiri
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_vertex_left);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_colors_left);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mag_faces_left);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MAG_MATRIX);
  
      GL.drawElements(
        GL.TRIANGLE_STRIP,
        magLeft.faces.length,
        GL.UNSIGNED_SHORT,
        0
      );

      //pelatuk
      // Draw Left
      GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX_LEFT);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, COLORS_LEFT);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES_LEFT);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, LEGG_KIRI_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, Left.faces.length, GL.UNSIGNED_SHORT, 0);

      //Pistol Kanan
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_vertex_right);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_colors_right);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mag_faces_right);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MAG_MATRIX);
  
      GL.drawElements(
        GL.TRIANGLE_STRIP,
        magLeft.faces.length,
        GL.UNSIGNED_SHORT,
        0
      );

      //pelatuk
      // Draw Right
      GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX_RIGHT);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, COLORS_RIGHT);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES_RIGHT);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, LEGG_KANAN_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, Left.faces.length, GL.UNSIGNED_SHORT, 0);
      /*========================= END ========================= */
  
      GL.flush();
  
      window.requestAnimationFrame(animate);
    };
  
    animate(0);
  }
  
  window.addEventListener("load", main);