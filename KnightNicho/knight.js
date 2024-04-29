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
    // setup
  
    var canvas = document.getElementById("1");
  
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    var drag = false;
  
    var rotateX = 0;
    var rotateY = 0;
  
    var alpha = 0;
    var theta = 0;
  
    var friction = 0.95;
  
    var keyDown = function (e) {
      drag = true;
      if (e.key === "ArrowUp") {
        console.log("UP");
        rotateY = -5;
        alpha += (rotateY * 2 * Math.PI) / canvas.height;
      } else if (e.key === "ArrowDown") {
        console.log("DOWN");
        rotateY = 5;
        alpha += (rotateY * 2 * Math.PI) / canvas.height;
      } else if (e.key === "ArrowLeft") {
        console.log("LEFT");
        rotateX = -5;
        theta += (rotateX * 2 * Math.PI) / canvas.width;
      } else if (e.key === "ArrowRight") {
        console.log("RIGHT");
        rotateX = 5;
        theta += (rotateX * 2 * Math.PI) / canvas.width;
      }
    };
  
    var keyUp = function (e) {
      drag = false;
    };
  
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keyup", keyUp, false);
  
    var GL;
  
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
    
            uniform mat4 PMatrix; //Projection
            uniform mat4 VMatrix; //View
            uniform mat4 MMatrix; //Model
    
            varying vec3 outColor;
            void main(void){
                gl_Position = PMatrix * VMatrix * MMatrix * vec4(position, 1.0);
                outColor = color;
            }
            
        `;
    var shader_fragment_source = ` 
            precision mediump float;
            
            varying vec3 outColor;
            void main(void){
                gl_FragColor = vec4(outColor, 1.);
            }
        `;
  
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
  
    var shader_program = GL.createProgram();
    GL.attachShader(shader_program, shader_vertex);
    GL.attachShader(shader_program, shader_fragment);
  
    GL.linkProgram(shader_program);
  
    var position_vao = GL.getAttribLocation(shader_program, "position");
    var color_vao = GL.getAttribLocation(shader_program, "color");
  
    //uniform
    var PMatrix_ = GL.getUniformLocation(shader_program, "PMatrix");
    var VMatrix_ = GL.getUniformLocation(shader_program, "VMatrix");
    var MMatrix_ = GL.getUniformLocation(shader_program, "MMatrix");
  
    GL.enableVertexAttribArray(position_vao);
    GL.enableVertexAttribArray(color_vao);
    GL.useProgram(shader_program);
  

  
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
    // x, y, z, width, height, depth, color
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
    // x, y, z, width, height, depth, color
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
  
    // Create buffers
  
  
    var PROJECTION_MATRIX = LIBS.get_projection(
      50,
      canvas.width / canvas.height,
      1,
      100
    );


    var KNIGHT_MODEL_MATRIX = LIBS.get_I4();
    var KNIGHT_VIEW_MATRIX = LIBS.get_I4();
  
    //kaki kanan
    var LEGG_KANAN_MATRIX = LIBS.get_I4();

    //kaki kiri
    var LEGG_KIRI_MATRIX = LIBS.get_I4();

    //magazine
    var MAG_MATRIX = LIBS.get_I4();
    

    LIBS.translateZ(KNIGHT_VIEW_MATRIX, -10);
  
    var prevTime = 0;
    var then = 0;

    var LEGGKananTime = 0;
    var LEGGKananReverse = false;
  
    var LEGGKiriTime = 0;
    var LEGGKiriReverse = false;

    var MagTime = 0;
    var MagReverse = false;

  
  
    GL.clearColor(0, 0, 0, 0);
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
  
    var animate = function (time) {
      GL.viewport(0, 0, canvas.width, canvas.height);
      GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
      time *= 0.001;
      var deltaTime = (time - then) * 100;
      then = time;
      
      
      prevTime = time;
      
  
      theta += (rotateX * 2 * Math.PI) / canvas.width;
      alpha += (rotateY * 2 * Math.PI) / canvas.width;
  
      if (!drag) {
        rotateX *= friction;
        rotateY *= friction;
      }
  
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

      // KAKI KANAN
      LIBS.rotateX(LEGG_KANAN_MATRIX, KF_LEGGKanan);
      LIBS.rotateY(LEGG_KANAN_MATRIX, theta);
      LIBS.rotateX(LEGG_KANAN_MATRIX, alpha);
  
      // KAKI KIRI
      LIBS.rotateX(LEGG_KIRI_MATRIX, KF_LEGGKiri);
      LIBS.rotateY(LEGG_KIRI_MATRIX, theta);
      LIBS.rotateX(LEGG_KIRI_MATRIX, alpha);

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
  
      LIBS.translateY(MAG_MATRIX, KF_Mag);
      LIBS.rotateY(MAG_MATRIX, theta);

    
      GL.bindBuffer(GL.ARRAY_BUFFER, triangle_vbo);
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, triangle_ebo);
      GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 6 * 4, 0);
      GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 6 * 4, 3 * 4);

      
  
      GL.uniformMatrix4fv(PMatrix_, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(VMatrix_, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(MMatrix_, false, KNIGHT_MODEL_MATRIX);

      // GL.drawArrays(GL.LINES, 0, cube.length/6);
      //Badan
      GL.drawElements(GL.TRIANGLES, cube_faces.length, GL.UNSIGNED_SHORT, 0);

      //kaki kanan
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_RIGHT_VERTEX);
      GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_RIGHT_COLORS);
      GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEGG_RIGHT_FACES);
  
      GL.uniformMatrix4fv(PMatrix_, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(VMatrix_, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(MMatrix_, false, LEGG_KANAN_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, LEGG_RIGHT.faces.length, GL.UNSIGNED_SHORT, 0);

      //kaki kiri
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_LEFT_VERTEX);
      GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, LEGG_LEFT_COLORS);
      GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, LEGG_LEFT_FACES);
  
      GL.uniformMatrix4fv(PMatrix_, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(VMatrix_, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(MMatrix_, false, LEGG_KIRI_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, LEGG_LEFT.faces.length, GL.UNSIGNED_SHORT, 0);
      
      // Pistol kiri
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_vertex_left);
      GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_colors_left);
      GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mag_faces_left);
  
      GL.uniformMatrix4fv(PMatrix_, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(VMatrix_, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(MMatrix_, false, MAG_MATRIX);
  
      GL.drawElements(
        GL.TRIANGLE_STRIP,
        magLeft.faces.length,
        GL.UNSIGNED_SHORT,
        0
      );

      //pelatuk
      // Draw Left
      GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX_LEFT);
      GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, COLORS_LEFT);
      GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES_LEFT);
  
      GL.uniformMatrix4fv(PMatrix_, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(VMatrix_, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(MMatrix_, false, LEGG_KIRI_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, Left.faces.length, GL.UNSIGNED_SHORT, 0);

      //Pistol Kanan
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_vertex_right);
      GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, mag_colors_right);
      GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mag_faces_right);
  
      GL.uniformMatrix4fv(PMatrix_, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(VMatrix_, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(MMatrix_, false, MAG_MATRIX);
  
      GL.drawElements(
        GL.TRIANGLE_STRIP,
        magLeft.faces.length,
        GL.UNSIGNED_SHORT,
        0
      );

      //pelatuk
      // Draw Right
      GL.bindBuffer(GL.ARRAY_BUFFER, VERTEX_RIGHT);
      GL.vertexAttribPointer(position_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, COLORS_RIGHT);
      GL.vertexAttribPointer(color_vao, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, FACES_RIGHT);
  
      GL.uniformMatrix4fv(PMatrix_, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(VMatrix_, false, KNIGHT_VIEW_MATRIX);
      GL.uniformMatrix4fv(MMatrix_, false, LEGG_KANAN_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, Left.faces.length, GL.UNSIGNED_SHORT, 0);

      

      GL.flush();
  
      window.requestAnimationFrame(animate);
    };
  
    animate(0);
  }
  
  window.addEventListener("load", main);