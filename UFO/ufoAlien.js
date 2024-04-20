function generateSolidTube(x, y, z, outerRadius, innerRadius, height, segments, color) {
    var vertices = [];
    var colors = [];
  
    var angleIncrement = (2 * Math.PI) / segments;
  
    for (var i = 0; i <= segments; i++) {
      var angle = i * angleIncrement;
      var cosAngle = Math.cos(angle);
      var sinAngle = Math.sin(angle);
  
      var outerX = x + outerRadius * cosAngle;
      var outerY = y + outerRadius * sinAngle;
      var innerX = x + innerRadius * cosAngle;
      var innerY = y + innerRadius * sinAngle;
  
      // Top face vertices
      vertices.push(outerX, outerY, z + height / 2);
      vertices.push(innerX, innerY, z + height / 2);
  
      // Bottom face vertices
      vertices.push(innerX, innerY, z - height / 2);
      vertices.push(outerX, outerY, z - height / 2);
  
      // Colors for each vertex
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
  
  function generateUfoOutline(a, b, c, segments) {
    var vertices = [];
    var colors = [];
  
    for (var i = 0; i <= segments; i++) {
      var u = -Math.PI + (2 * Math.PI * i) / segments;
  
      for (var j = 0; j <= segments; j++) {
        var v = -Math.PI + (2 * Math.PI * j) / segments;
  
        var xCoord = -a * Math.cos(v) * Math.cos(u);
        var yCoord = -b * Math.cos(v) * Math.sin(u);
        var zCoord = -c * Math.sin(v);
  
        vertices.push(xCoord, yCoord, zCoord);
  
        colors.push(0.6, 0.6, 0.6);
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

  function generateUfo(a, b, c, segments) {
    var vertices = [];
    var colors = [];
  
    for (var i = 0; i <= segments; i++) {
      var u = -Math.PI + (2 * Math.PI * i) / segments;
  
      for (var j = 0; j <= segments; j++) {
        var v = -Math.PI + (2 * Math.PI * j) / segments;
  
        var xCoord = -a * Math.cos(v) * Math.cos(u);
        var yCoord = -b * Math.cos(v) * Math.sin(u);
        var zCoord = -c * Math.sin(v);
  
        vertices.push(xCoord, yCoord, zCoord);
  
        colors.push(0.3, 0.3, 0.3);
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

  function generateHalfSphere(x, y, z, radius, segments, color) {
    var vertices = [];
    var colors = [];

    var angleIncrement = Math.PI / segments;

    // Generate vertices for the half sphere
    for (var i = 0; i <= segments / 2; i++) {
        var theta = i * angleIncrement;
        var cosTheta = Math.cos(theta);
        var sinTheta = Math.sin(theta);

        for (var j = 0; j <= segments; j++) {
            var phi = j * 2 * Math.PI / segments;
            var cosPhi = Math.cos(phi);
            var sinPhi = Math.sin(phi);

            var xCoord = x + radius * cosTheta * cosPhi;
            var yCoord = y + radius * cosTheta * sinPhi;
            var zCoord = z + radius * sinTheta;

            vertices.push(xCoord, yCoord, zCoord);
            colors = colors.concat(color);
        }
    }

    var numVertices = vertices.length / 3;

    // Generate faces for the half sphere
    var faces = [];
    for (var i = 0; i < segments / 2; i++) {
        for (var j = 0; j < segments; j++) {
            var startIndex = i * (segments + 1) + j;
            var nextStartIndex = startIndex + segments + 1;

            // Triangle 1
            faces.push(startIndex, nextStartIndex, startIndex + 1);

            // Triangle 2
            faces.push(startIndex + 1, nextStartIndex, nextStartIndex + 1);
        }
    }

    return { vertices: vertices, colors: colors, faces: faces };
}

function generateSkullFace(x, y, z, radius, color) {
    var vertices = [];
    var colors = [];
    
    // Define the positions of the skull features
    var eyeOffset = 0.4 * radius;
    var eyeRadius = 0.1 * radius;
    var noseOffset = 0;
    var noseWidth = 0.2 * radius;
    var mouthOffset = -0.4 * radius;
    var mouthWidth = 0.6 * radius;
    var mouthHeight = 0.2 * radius;
    
    // Add vertices for the eyes
    vertices.push(x - eyeOffset, y, z); // Left eye
    vertices.push(x + eyeOffset, y, z); // Right eye
    colors = colors.concat(color, color);
    
    // Add vertices for the nose (a triangle)
    vertices.push(x, y - noseOffset, z); // Nose tip
    vertices.push(x - noseWidth / 2, y - noseOffset, z); // Left side of nose
    vertices.push(x + noseWidth / 2, y - noseOffset, z); // Right side of nose
    colors = colors.concat(color, color, color);
    
    // Add vertices for the mouth (a rectangle)
    vertices.push(x - mouthWidth / 2, y + mouthOffset, z); // Top left
    vertices.push(x + mouthWidth / 2, y + mouthOffset, z); // Top right
    vertices.push(x - mouthWidth / 2, y + mouthOffset - mouthHeight, z); // Bottom left
    vertices.push(x + mouthWidth / 2, y + mouthOffset - mouthHeight, z); // Bottom right
    colors = colors.concat(color, color, color, color);
    
    // Define faces for the skull features
    var faces = [
        0, 1, 2, // Eyes
        3, 4, 5, // Nose
        6, 7, 8, 9 // Mouth
    ];
    
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
    var theta = Math.PI / 2;
  
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
    

    //===================== HalfSphere - Kepala ========================
    var halfSphereData = generateHalfSphere(0, 0, 2.5, 1.5, 30, [0, 1, 1]);

    // Create buffers
    var halfSphere_vertex = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, halfSphere_vertex);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(halfSphereData.vertices),
        GL.STATIC_DRAW
    );

    var halfSphere_colors = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, halfSphere_colors);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(halfSphereData.colors),
        GL.STATIC_DRAW
    );

    var halfSphere_faces = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, halfSphere_faces);
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(halfSphereData.faces),
        GL.STATIC_DRAW
    );
    //===================== HalfSphere - Kepala ========================


    //===================== Tube Badan ========================
    //Gambar tube untuk badan
    var tubeData = generateSolidTube(0, 0, 1, 1.5, 1, 3, 30, [0, 1, 1]);
  
    // Create buffers for the first octagon
    var SOLID_TUBES_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES_VERTEX);
    GL.bufferData(
      GL.ARRAY_BUFFER,
      new Float32Array(tubeData.vertices),
      GL.STATIC_DRAW
    );
  
    var SOLID_TUBES_COLORS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES_COLORS);
    GL.bufferData(
      GL.ARRAY_BUFFER,
      new Float32Array(tubeData.colors),
      GL.STATIC_DRAW
    );
  
    var SOLID_TUBES_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_TUBES_FACES);
    GL.bufferData(
      GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(tubeData.faces),
      GL.STATIC_DRAW
    );

    //===================== Tube Badan backpack ========================
    //Gambar tube untuk badan
    var tubeData2 = generateSolidTube(2.2, 0, 1, 0.65, 0.4, 3, 30, [0.4, 0.4, 0.4]);
  
    // Create buffers for the first octagon
    var SOLID_TUBES2_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES2_VERTEX);
    GL.bufferData(
      GL.ARRAY_BUFFER,
      new Float32Array(tubeData2.vertices),
      GL.STATIC_DRAW
    );
  
    var SOLID_TUBES2_COLORS = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES2_COLORS);
    GL.bufferData(
      GL.ARRAY_BUFFER,
      new Float32Array(tubeData2.colors),
      GL.STATIC_DRAW
    );
  
    var SOLID_TUBES2_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_TUBES2_FACES);
    GL.bufferData(
      GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(tubeData2.faces),
      GL.STATIC_DRAW
    );
   


    //====================== muka ==========================
    var skullFaceData = generateSkullFace(0, 0, 5, 5, [0, 0, 0]);

    var skullface_vertex = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, skullface_vertex);
    GL.bufferData(
      GL.ARRAY_BUFFER,
      new Float32Array(skullFaceData.vertices),
      GL.STATIC_DRAW
    );
  
    var skullface_colors = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, skullface_colors);
    GL.bufferData(
      GL.ARRAY_BUFFER,
      new Float32Array(skullFaceData.colors),
      GL.STATIC_DRAW
    );
  
    var skullface_faces = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skullface_faces);
    GL.bufferData(
      GL.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(skullFaceData.faces),
      GL.STATIC_DRAW
    );


    //===================== ufo - kaki ========================
    
    //Outline kaki
    // gambar ellip untuk kaki
    var ellipsoidDataOutline = generateUfoOutline(2.5, 2.5, 1.2, 40);

    // Create buffers
    var ellip_outline_vertex = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ellip_outline_vertex);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(ellipsoidDataOutline.vertices),
        GL.STATIC_DRAW
    );

    var ellip_outline_colors = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ellip_outline_colors);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(ellipsoidDataOutline.colors),
        GL.STATIC_DRAW
    );

    var ellip_outline_faces = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ellip_outline_faces);
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(ellipsoidDataOutline.faces),
        GL.STATIC_DRAW
    );


    // gambar ufo
    var ellipsoidData = generateUfo(2.2, 2.2, 1.5, 40);

    // Create buffers
    var ellip_vertex = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ellip_vertex);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(ellipsoidData.vertices),
        GL.STATIC_DRAW
    );

    var ellip_colors = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, ellip_colors);
    GL.bufferData(
        GL.ARRAY_BUFFER,
        new Float32Array(ellipsoidData.colors),
        GL.STATIC_DRAW
    );

    var ellip_faces = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ellip_faces);
    GL.bufferData(
        GL.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(ellipsoidData.faces),
        GL.STATIC_DRAW
    );
    
    
    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(
      40,
      CANVAS.width / CANVAS.height,
      1,
      100
    );
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
  
    LIBS.rotateY(VIEW_MATRIX, Math.PI / 2);
    LIBS.rotateX(VIEW_MATRIX, Math.PI / 2);
    LIBS.translateZ(VIEW_MATRIX, -20);
  
    /*========================= DRAWING ========================= */
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
  
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
  
    var time_prev = 0;
    var animate = function (time) {
      GL.viewport(0, 0, CANVAS.width, CANVAS.height);
      GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
  
      var dt = time - time_prev;
      time_prev = time;
  
      if (!drag) {
        dx *= friction;
        dy *= friction;
  
        theta += (dx * 2 * Math.PI) / CANVAS.width;
        alpha += (dy * 2 * Math.PI) / CANVAS.height;
      }
  
      MODEL_MATRIX = LIBS.get_I4();
      LIBS.rotateY(MODEL_MATRIX, theta);
      LIBS.rotateX(MODEL_MATRIX, alpha);
  
      //gambar ellip kepala
      GL.bindBuffer(GL.ARRAY_BUFFER, halfSphere_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, halfSphere_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, halfSphere_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_FAN, halfSphereData.faces.length, GL.UNSIGNED_SHORT, 0);


      // Draw tuba untuk badan
      GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_TUBES_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_FAN, tubeData.faces.length, GL.UNSIGNED_SHORT, 0);


       
      //gambar ufo outline
      GL.bindBuffer(GL.ARRAY_BUFFER, ellip_outline_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, ellip_outline_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ellip_outline_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ellipsoidDataOutline.faces.length, GL.UNSIGNED_SHORT, 0);

      //gambar ufo bawah
      GL.bindBuffer(GL.ARRAY_BUFFER, ellip_vertex);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, ellip_colors);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, ellip_faces);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
      GL.drawElements(GL.TRIANGLES, ellipsoidData.faces.length, GL.UNSIGNED_SHORT, 0);

      // Draw tuba untuk backpack
      GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES2_VERTEX);
      GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ARRAY_BUFFER, SOLID_TUBES2_COLORS);
      GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
      GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, SOLID_TUBES2_FACES);
  
      GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
      GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
      GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
      GL.drawElements(GL.TRIANGLE_FAN, tubeData2.faces.length, GL.UNSIGNED_SHORT, 0);

    //   // Draw muka
    //   GL.bindBuffer(GL.ARRAY_BUFFER, skullface_vertex);
    //   GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 0, 0);
  
    //   GL.bindBuffer(GL.ARRAY_BUFFER, skullface_colors);
    //   GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 0, 0);
  
    //   GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, skullface_faces);
  
    //   GL.uniformMatrix4fv(_PMatrix, false, PROJECTION_MATRIX);
    //   GL.uniformMatrix4fv(_VMatrix, false, VIEW_MATRIX);
    //   GL.uniformMatrix4fv(_MMatrix, false, MODEL_MATRIX);
  
    //   GL.drawElements(GL.TRIANGLES, skullFaceData.faces.length, GL.UNSIGNED_SHORT, 0);
  


      GL.flush();
  
      window.requestAnimationFrame(animate);
    };
  
    animate(0);
  }
  
  window.addEventListener("load", main);
  