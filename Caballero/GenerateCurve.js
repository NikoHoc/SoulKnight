function generateCurvePistol(x, y, z, radius, width, length, segments, right, rgbColor) {
  var vertices = [];
  var colors = [];

  var colorss = [rgbColor]; // Use the provided RGB color

  var halfSegments = Math.floor(segments / 2); // Taking half of the segments to draw a quadrant

  // Rotate angle by 90 degrees along the y-axis
  var rotateAngle = Math.PI / 48;

  for (var i = 0; i <= halfSegments; i++) {
    var latAngle = Math.PI * (-0.5 + i / segments);
    var sinLat = Math.sin(latAngle);
    var cosLat = Math.cos(latAngle);

    for (var j = 0; j <= halfSegments; j++) {
      var lonAngle = 2 * Math.PI * (j / segments);
      var sinLon = Math.sin(lonAngle);
      var cosLon = Math.cos(lonAngle);

      var xCoord = cosLon * cosLat * width;
      var yCoord = sinLon * cosLat * length;
      var zCoord = sinLat * radius;

      // Rotate horizontally to the right
      var rotatedXCoord = xCoord * Math.cos(rotateAngle) - zCoord * Math.sin(rotateAngle);
      var rotatedZCoord = xCoord * Math.sin(rotateAngle) + zCoord * Math.cos(rotateAngle);

      var vertexX, vertexY, vertexZ;
      if (right == true) {
        // Right side
        vertexX = x + rotatedXCoord;
        vertexY = y + yCoord; // No rotation along the y-axis
        vertexZ = z + rotatedZCoord;
      } else {
        // Left side
        vertexX = x - rotatedXCoord;
        vertexY = y + yCoord; // No rotation along the y-axis
        vertexZ = z + rotatedZCoord;
      }

      vertices.push(vertexX, vertexY, vertexZ);
      colors = colors.concat(rgbColor); // Assign the provided RGB color to all vertices
    }
  }

  var faces = [];
  for (var i = 0; i < halfSegments; i++) {
    for (var j = 0; j < halfSegments; j++) {
      var index = i * (halfSegments + 1) + j;
      var nextIndex = index + halfSegments + 1;

      faces.push(index, nextIndex, index + 1);
      faces.push(nextIndex, nextIndex + 1, index + 1);
    }
  }

  return { vertices: vertices, colors: colors, faces: faces };
}