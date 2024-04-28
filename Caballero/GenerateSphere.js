function generateSphere(x, y, z, radius, segments) {
    var vertices = [];
    var colors = [];
  
    var colorss = [
      [1.0, 0.0, 0],
      [1.0, 0.0, 0.0],
    ];
  
    for (var i = 0; i <= segments; i++) {
      var latAngle = Math.PI * (-0.5 + i / segments);
      var sinLat = Math.sin(latAngle);
      var cosLat = Math.cos(latAngle);
  
      for (var j = 0; j <= segments; j++) {
        var lonAngle = 2 * Math.PI * (j / segments);
        var sinLon = Math.sin(lonAngle);
        var cosLon = Math.cos(lonAngle);
  
        var xCoord = cosLon * cosLat;
        var yCoord = sinLon * cosLat;
        var zCoord = sinLat;
  
        var vertexX = x + radius * xCoord;
        var vertexY = y + radius * yCoord;
        var vertexZ = z + radius * zCoord;
  
        vertices.push(vertexX, vertexY, vertexZ);
  
        var colorIndex = j % colorss.length;
        colors = colors.concat(colorss[colorIndex]);
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