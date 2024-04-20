function generateEllipsoid(a, b, c, segments) {
  var vertices = [];
  var colors = [];

  for (var i = 0; i <= segments; i++) {
    var u = -Math.PI + (2 * Math.PI * i) / segments;

    for (var j = 0; j <= segments; j++) {
      var v = -Math.PI + (2 * Math.PI * j) / segments;

      var xCoord = a * Math.cos(v) * Math.cos(u);
      var yCoord = b * Math.cos(v) * Math.sin(u);
      var zCoord = c * Math.sin(v);

      vertices.push(xCoord, yCoord, zCoord);

      colors.push(0.0, 1.0, 0.0);
    }
  }

  var faces = [];
  for (var i = 0; i < segments; i++) {
    for (var j = 0; j < segments; j++) {
      var index = i * (segments + 1) + j;
      var nextIndex = index + segments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }

  return { vertices: vertices, colors: colors, faces: faces };
}

var GL;
class MyObject {
  shader_program = null;
  color_vao = null;
  position_vao = null;

  _MMatrix = null;
  _PMatrix = null;
  _VMatrix = null;
  _greyScality = null;

  TRIANGLE_VERTEX = null;
  TRIANGLE_FACES = null;

  //   TUBE_VERTEX = null;
  //   TUBE_FACES = null;

  texture = null;

  childs = [];

  MODEL_MATRIX = LIBS.get_I4();

  constructor(vertex, faces, shader_vertex_source, shader_fragment_source) {
    this.vertex = vertex;
    this.faces = faces;
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

    this.shader_program = GL.createProgram();
    GL.attachShader(this.shader_program, shader_vertex);
    GL.attachShader(this.shader_program, shader_fragment);
    GL.linkProgram(this.shader_program);

    //vao vertex array object
    this.position_vao = GL.getAttribLocation(this.shader_program, "position");
    this.color_vao = GL.getAttribLocation(this.shader_program, "color");
    this._uv = GL.getAttribLocation(this.shader_program, "uv");

    GL.enableVertexAttribArray(this.position_vao);
    GL.enableVertexAttribArray(this.color_vao);
    GL.enableVertexAttribArray(this._uv);

    //Uniform
    this._PMatrix = GL.getUniformLocation(this.shader_program, "PMatrix");
    this._VMatrix = GL.getUniformLocation(this.shader_program, "VMatrix");
    this._MMatrix = GL.getUniformLocation(this.shader_program, "MMatrix");
    this._greyScality = GL.getUniformLocation(
      this.shader_program,
      "greyScality"
    );
    this._sampler = GL.getUniformLocation(this.shader_program, "sampler");

    GL.useProgram(this.shader_program);

    this.TRIANGLE_VERTEX = GL.createBuffer();
    this.TRIANGLE_FACES = GL.createBuffer();

    // this.TUBE_VERTEX = GL.createBuffer();
    // this.TUBE_FACES = GL.createBuffer();

    this.texture = LIBS.load_texture("tes.jpg");
  }

  setup() {
    //VBO, vertex buffer object (menerima titik2 yg dibuat)
    GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
    GL.bufferData(
      GL.ARRAY_BUFFER,
      new Float32Array(this.vertex),
      GL.STATIC_DRAW
    );

    //EBO, element buffer object (menerima element yg sudah dibuat)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
    GL.bufferData(
      GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.faces),
      GL.STATIC_DRAW
    );

    this.childs.forEach((child) => {
      child.setup();
    });
  }

  render(VIEW_MATRIX, PROJECTION_MATRIX) {
    GL.useProgram(this.shader_program);

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, this.texture);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.TRIANGLE_VERTEX);

    GL.vertexAttribPointer(
      this.position_vao,
      3,
      GL.FLOAT,
      false,
      4 * (3 + 3 + 2),
      0
    );
    GL.vertexAttribPointer(
      this.color_vao,
      3,
      GL.FLOAT,
      false,
      4 * (3 + 3 + 2),
      3 * 4
    );
    GL.vertexAttribPointer(
      this._uv,
      2,
      GL.FLOAT,
      false,
      4 * (3 + 3 + 2),
      (3 + 3) * 4
    );

    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);

    //Uniform matrix 1
    GL.uniformMatrix4fv(this._PMatrix, false, PROJECTION_MATRIX);
    GL.uniformMatrix4fv(this._VMatrix, false, VIEW_MATRIX);
    GL.uniformMatrix4fv(this._MMatrix, false, this.MODEL_MATRIX);
    GL.uniform1f(this._greyScality, 1);
    GL.uniform1i(this._sampler, 0);

    GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);

    //GL.drawElements(GL.TRIANGLES, this.faces.length, GL.UNSIGNED_SHORT, 0);

    this.childs.forEach((child) => {
      child.render(VIEW_MATRIX, PROJECTION_MATRIX);
    });
  }
}

function main() {
  // setup
  var canvas = document.getElementById("myCanvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var drag = false;

  var X_prev = 0;
  var Y_prev = 0;

  var dX = 0;
  var dY = 0;

  var THETA = 0;
  var ALPHA = 0;

  var FRICTION = 0.95;

  var mouseDown = function (e) {
    drag = true;
    X_prev = e.pageX;
    Y_prev = e.pageY;
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

    dX = e.pageX - X_prev;
    dY = e.pageY - Y_prev;

    console.log(dX + " " + dY);
    X_prev = e.pageX;
    Y_prev = e.pageY;

    THETA += (dX * 2 * Math.PI) / canvas.width;
    ALPHA += (dY * 2 * Math.PI) / canvas.height;
  };

  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUP, false);
  canvas.addEventListener("mouseout", mouseOut, false);
  canvas.addEventListener("mousemove", mouseMove, false);

  var keydown = function (e) {
    drag = true;
    if (e.key === "W" || e.key === "w") {
      console.log("UP");
      dY = -55;
      ALPHA += (dY * 2 * Math.PI) / canvas.height;
    } else if (e.key === "S" || e.key === "s") {
      console.log("DOWN");
      dY = 55;
      ALPHA += (dY * 2 * Math.PI) / canvas.height;
    } else if (e.key === "A" || e.key === "a") {
      console.log("LEFT");
      dX = -55;
      THETA += (dX * 2 * Math.PI) / canvas.width;
    } else if (e.key === "D" || e.key === "d") {
      console.log("RIGHT");
      dX = 55;
      THETA += (dX * 2 * Math.PI) / canvas.width;
    }
  };

  var keyup = function (e) {
    drag = false;
  };

  document.addEventListener("keydown", keydown, false);
  document.addEventListener("keyup", keyup, false);

  try {
    GL = canvas.getContext("webgl", { antialias: true });
  } catch (e) {
    alert(e);

    return false;
  }

  // shader
  var shader_vertex_source = `
            attribute vec3 position;
            attribute vec3 color;
            attribute vec2 uv;
    
            uniform mat4 PMatrix; //Projection
            uniform mat4 VMatrix; //View
            uniform mat4 MMatrix; //Model

            varying vec3 outColor;
            varying vec2 vUV;
            void main(void){
                gl_Position = PMatrix * VMatrix * MMatrix * vec4(position, 1.0);
                outColor = color;
                vUV = uv;
            }
            
        `;
  var shader_fragment_source = ` 
            precision mediump float;
            varying vec3 outColor;
            varying vec2 vUV;

            //uniform vec3 color;

            uniform float greyScality;
            uniform sampler2D sampler;

            void main(void){
                float greyScaleValue = (outColor.r + outColor.b + outColor.g)/3.;
                vec3 greyScaleColor = vec3(greyScaleValue, greyScaleValue, greyScaleValue);
                vec3 Color = mix(greyScaleColor, outColor, greyScality);
                gl_FragColor = vec4(Color, 1.);
                gl_FragColor = texture2D(sampler, vUV);
            }
        `;

  var cube = [
    //belakang
    -1, -1, -1, 1, 1, 0, 0, 0, 1, -1, -1, 1, 1, 0, 1, 0, 1, 1, -1, 1, 1, 0, 1,
    1, -1, 1, -1, 1, 1, 0, 0, 1,

    //depan
    -1, -1, 1, 0, 0, 1, 0, 0, 1, -1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1,
    -1, 1, 1, 0, 0, 1, 0, 1,

    //kiri
    -1, -1, -1, 0, 1, 1, 0, 0, -1, 1, -1, 0, 1, 1, 1, 0, -1, 1, 1, 0, 1, 1, 1,
    1, -1, -1, 1, 0, 1, 1, 0, 1,

    //kanan
    1, -1, -1, 1, 0, 0, 0, 0, 1, 1, -1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1,
    1, -1, 1, 1, 0, 0, 0, 1,

    //bawah
    -1, -1, -1, 1, 0, 1, 0, 0, -1, -1, 1, 1, 0, 1, 1, 0, 1, -1, 1, 1, 0, 1, 1,
    1, 1, -1, -1, 1, 0, 1, 0, 1,

    //atas
    -1, 1, -1, 0, 1, 0, 0, 0, -1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1,
    1, 1, -1, 0, 1, 0, 0, 1,
  ];

  var cube_faces = [
    0, 1, 2, 0, 2, 3,

    4, 5, 6, 4, 6, 7,

    8, 9, 10, 8, 10, 11,

    12, 13, 14, 12, 14, 15,

    16, 17, 18, 16, 18, 19,

    20, 21, 22, 20, 22, 23,
  ];

  var tubeData = generateEllipsoid(2, 2, 2, 50);

  //============================== DRAWING ===============================

  var obj = new MyObject(
    cube,
    cube_faces,
    shader_vertex_source,
    shader_fragment_source
  );

  var obj2 = new MyObject(
    cube,
    cube_faces,
    shader_vertex_source,
    shader_fragment_source
  );

  obj.childs.push(obj2);
  obj.setup();

  //Matrix
  //Angle, a, Zmin, Zmax
  var PROJECTION_MATRIX = LIBS.get_projection(
    50,
    canvas.width / canvas.height,
    1,
    100
  );
  var MODEL_MATRIX = LIBS.get_I4();
  var VIEW_MATRIX = LIBS.get_I4();

  var MODEL_MATRIX2 = LIBS.get_I4();

  //Geser kamera karena ada yang ketumpuk
  //Karna objek di 0 dan kamera di 0
  LIBS.translateZ(VIEW_MATRIX, -10);

  GL.enable(GL.DEPTH_TEST);
  GL.depthFunc(GL.LEQUAL);

  var prev_time = 0;

  var animate = function (time) {
    //pakai time agar jeda antar frame sama
    var dt = time - prev_time;
    prev_time = time;

    GL.clearColor(0, 0, 0, 0);
    GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);

    THETA += (dX * 2 * Math.PI) / canvas.width;
    ALPHA += (dY * 2 * Math.PI) / canvas.height;

    if (!drag) {
      dX *= FRICTION;
      dY *= FRICTION;
    }

    var radius = 2;
    var pos_x = radius * Math.cos(ALPHA) * Math.cos(THETA);
    var pos_y = radius * Math.sin(ALPHA);
    var pos_z = radius * Math.cos(ALPHA) * Math.sin(THETA);

    //MATRIX 1
    MODEL_MATRIX = LIBS.get_I4();
    LIBS.rotateX(MODEL_MATRIX, ALPHA);
    LIBS.rotateY(MODEL_MATRIX, THETA);
    LIBS.translateX(MODEL_MATRIX, -4);

    // LIBS.translateY(MODEL_MATRIX, 2);
    // LIBS.translateZ(MODEL_MATRIX, -20);

    //LIBS.setPosition(MODEL_MATRIX, pos_x, pos_y, pos_z);

    //MATRIX 2
    MODEL_MATRIX2 = LIBS.get_I4();
    LIBS.rotateX(MODEL_MATRIX2, -ALPHA);
    LIBS.rotateY(MODEL_MATRIX2, -THETA);
    LIBS.translateX(MODEL_MATRIX2, 4);

    // LIBS.translateY(MODEL_MATRIX2, 2);
    // LIBS.translateZ(MODEL_MATRIX2, -20);

    //LIBS.setPosition(MODEL_MATRIX2, -pos_x, -pos_y, -pos_z);

    var temp = LIBS.get_I4();
    LIBS.translateX(temp, -6);
    MODEL_MATRIX2 = LIBS.multiply(MODEL_MATRIX2, temp);

    temp = LIBS.get_I4();
    LIBS.rotateY(temp, ALPHA);
    MODEL_MATRIX2 = LIBS.multiply(MODEL_MATRIX2, temp);
    X_prev;
    temp = LIBS.get_I4();
    LIBS.translateX(temp, 6);
    MODEL_MATRIX2 = LIBS.multiply(MODEL_MATRIX2, temp);

    obj2.MODEL_MATRIX = MODEL_MATRIX2;

    obj.MODEL_MATRIX = MODEL_MATRIX;
    obj.render(VIEW_MATRIX, PROJECTION_MATRIX);

    GL.flush();

    window.requestAnimationFrame(animate);
  };

  animate(0);
}

window.addEventListener("load", main);
