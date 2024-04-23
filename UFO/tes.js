function generateTabung(x, y, z, outerRadius, innerRadius, height, segments, color) {
    var vertices = [];
    var colors = [];
  
    var angleIncrement = (2 * Math.PI) / segments;
  
    // Rotate angle by 90 degrees around the x-axis
    var rotateAngle = Math.PI / 2;
  
    for (var i = 0; i <= segments; i++) {
      var angle = i * angleIncrement;
      var cosAngle = Math.cos(angle);
      var sinAngle = Math.sin(angle);
  
      var outerX = x + outerRadius * cosAngle;
      var outerY = y + outerRadius * sinAngle; // Adjust y-coordinate to apply rotation
      var innerX = x + innerRadius * cosAngle;
      var innerY = y + innerRadius * sinAngle; // Adjust y-coordinate to apply rotation
  
      // Rotate coordinates by 90 degrees around the x-axis
      var rotatedOuterZ = z + height / 2;
      var rotatedInnerZ = z - height / 2;
  
      vertices.push(outerX, outerY, rotatedOuterZ);
      vertices.push(innerX, innerY, rotatedOuterZ);
      vertices.push(innerX, innerY, rotatedInnerZ);
      vertices.push(outerX, outerY, rotatedInnerZ);
  
      colors = colors.concat(color, color, color, color);
    }
  
    var faces = [];
    var numVertices = segments * 4;
  
    for (var i = 0; i < segments; i++) {
      var startIndex = i * 4;
      var nextStartIndex = (i + 1) * 4;
  
      // Side faces
      faces.push(startIndex, nextStartIndex, nextStartIndex + 1);
      faces.push(startIndex, nextStartIndex + 1, startIndex + 1);
  
      faces.push(startIndex + 1, nextStartIndex + 1, nextStartIndex + 2);
      faces.push(startIndex + 1, nextStartIndex + 2, startIndex + 2);
  
      faces.push(startIndex + 2, nextStartIndex + 2, nextStartIndex + 3);
      faces.push(startIndex + 2, nextStartIndex + 3, startIndex + 3);
  
      faces.push(startIndex + 3, nextStartIndex + 3, nextStartIndex);
      faces.push(startIndex + 3, nextStartIndex, startIndex);
    }
  
    return { vertices: vertices, colors: colors, faces: faces };
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
  
   
  
    /*========================= MATRIX ========================= */
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 100);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
  
    LIBS.translateZ(VIEW_MATRIX, -50);
  
    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
  
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
  
    var animate = function (time) {
      GL.viewport(0, 0, CANVAS.width, CANVAS.height);
      GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
  
      time *= 0.009;
  
      if (!drag) {
        dx *= friction;
        dy *= friction;
  
        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
      }
  
      /*========================= TIME ========================= */
  
      MODEL_MATRIX = LIBS.get_I4();
      LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
  
  
      /*========================= WEAPONS ========================= */
      GL.bindBuffer(GL.ARRAY_BUFFER, tabungVertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, tabungColors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, tabungFaces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, tabung.faces.length, GL.UNSIGNED_SHORT, 0);
  
      
  
      GL.flush();
  
      window.requestAnimationFrame(animate);
    };
  
    animate(0);
  }
  
  window.addEventListener("load", main);
  