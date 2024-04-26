export function generateUFO(a, b, c, segments, translateX, translateY, translateZ, color) {
  var vertices = [];
  var colors = [];

  for (var i = 0; i <= segments; i++) {
    var u = -Math.PI + (2 * Math.PI * i) / segments;

    for (var j = 0; j <= segments; j++) {
      var v = -Math.PI + (2 * Math.PI * j) / segments;

      // Rotate around X-axis by 90 degrees
      var tempX = -a * Math.cos(v) * Math.cos(u);
      var tempY = -b * Math.cos(v) * Math.sin(u);
      var tempZ = -c * Math.sin(v);

      // Apply rotation around X-axis by 90 degrees
      var xRotated = tempX;
      var yRotated =
        tempY * Math.cos(Math.PI / 2) - tempZ * Math.sin(Math.PI / 2);
      var zRotated =
        tempY * Math.sin(Math.PI / 2) + tempZ * Math.cos(Math.PI / 2);

      var xCoord = xRotated + translateX; // Apply translation for X
      var yCoord = yRotated + translateY; // Apply translation for Y
      var zCoord = zRotated + translateZ; // Apply translation for Z

      vertices.push(xCoord, yCoord, zCoord);

      colors.push(color[0], color[1], color[2]);
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