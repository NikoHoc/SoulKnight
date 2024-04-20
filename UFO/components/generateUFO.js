export function generateUfoOutline(a, b, c, segments) {
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

export function generateUfo(a, b, c, segments) {
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