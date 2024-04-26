function generateSolidOctagon(x, y, z, outerRadius, innerRadius, height, segments, color) {
  var vertices = [];
  var colors = [];

  var angleIncrement = (2 * Math.PI) / segments;

  // Rotate angle by 90 degrees along the x-axis
  var rotateAngle = Math.PI / 2;

  for (var i = 0; i <= segments; i++) {
    var angle = i * angleIncrement;
    var cosAngle = Math.cos(angle + rotateAngle); // Add rotation angle
    var sinAngle = Math.sin(angle + rotateAngle); // Add rotation angle

    var outerX = x + outerRadius * cosAngle;
    var outerZ = z + outerRadius * sinAngle; // Adjust z-coordinate to apply rotation
    var innerX = x + innerRadius * cosAngle;
    var innerZ = z + innerRadius * sinAngle; // Adjust z-coordinate to apply rotation

    vertices.push(outerX, y - height / 2, outerZ); // Subtract height/2 to rotate along x-axis
    vertices.push(innerX, y - height / 2, innerZ); // Subtract height/2 to rotate along x-axis
    vertices.push(innerX, y + height / 2, innerZ); // Add height/2 to rotate along x-axis
    vertices.push(outerX, y + height / 2, outerZ); // Add height/2 to rotate along x-axis

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

function generateCube(x, y, z, width, height, depth, color) {
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  var halfDepth = depth / 2;

  var vertices = [
    // Front face
    x - halfWidth,
    y - halfHeight,
    z + halfDepth,
    x + halfWidth,
    y - halfHeight,
    z + halfDepth,
    x + halfWidth,
    y + halfHeight,
    z + halfDepth,
    x - halfWidth,
    y + halfHeight,
    z + halfDepth,

    // Back face
    x - halfWidth,
    y - halfHeight,
    z - halfDepth,
    x - halfWidth,
    y + halfHeight,
    z - halfDepth,
    x + halfWidth,
    y + halfHeight,
    z - halfDepth,
    x + halfWidth,
    y - halfHeight,
    z - halfDepth,

    // Top face
    x - halfWidth,
    y + halfHeight,
    z - halfDepth,
    x - halfWidth,
    y + halfHeight,
    z + halfDepth,
    x + halfWidth,
    y + halfHeight,
    z + halfDepth,
    x + halfWidth,
    y + halfHeight,
    z - halfDepth,

    // Bottom face
    x - halfWidth,
    y - halfHeight,
    z - halfDepth,
    x + halfWidth,
    y - halfHeight,
    z - halfDepth,
    x + halfWidth,
    y - halfHeight,
    z + halfDepth,
    x - halfWidth,
    y - halfHeight,
    z + halfDepth,

    // Right face
    x + halfWidth,
    y - halfHeight,
    z - halfDepth,
    x + halfWidth,
    y + halfHeight,
    z - halfDepth,
    x + halfWidth,
    y + halfHeight,
    z + halfDepth,
    x + halfWidth,
    y - halfHeight,
    z + halfDepth,

    // Left face
    x - halfWidth,
    y - halfHeight,
    z - halfDepth,
    x - halfWidth,
    y - halfHeight,
    z + halfDepth,
    x - halfWidth,
    y + halfHeight,
    z + halfDepth,
    x - halfWidth,
    y + halfHeight,
    z - halfDepth,
  ];

  var colors = [];
  for (var i = 0; i < 6; i++) {
    colors = colors.concat(color, color, color, color);
  }

  var faces = [
    0,
    1,
    2,
    0,
    2,
    3, // Front face
    4,
    5,
    6,
    4,
    6,
    7, // Back face
    8,
    9,
    10,
    8,
    10,
    11, // Top face
    12,
    13,
    14,
    12,
    14,
    15, // Bottom face
    16,
    17,
    18,
    16,
    18,
    19, // Right face
    20,
    21,
    22,
    20,
    22,
    23, // Left face
  ];

  return { vertices: vertices, colors: colors, faces: faces };
}

function generateShoulder(x, y, z, radius, width, length, segments, right, rgbColor) {
  var vertices = [];
  var colors = [];

  var colorss = [rgbColor]; // Use the provided RGB color

  var halfSegments = Math.floor(segments / 2); // Taking half of the segments to draw a quadrant

  // Rotate angle by 90 degrees along the y-axis
  var rotateAngle = Math.PI / 2;

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

function generateWorld(width, length, height) {
  var vertices = [];
  var colors = [];
  var faces = [];
  var worldColors = [153/255, 76/255, 0/255];

  var halfWidth = width / 2;
  var halfLength = length / 2;
  var halfHeight = height / 2;

  vertices = [
    // Front face
    -halfWidth,
    halfHeight,
    halfLength,
    -halfWidth,
    -halfHeight,
    halfLength,
    halfWidth,
    -halfHeight,
    halfLength,
    halfWidth,
    halfHeight,
    halfLength,

    // Back face
    -halfWidth,
    halfHeight,
    -halfLength,
    -halfWidth,
    -halfHeight,
    -halfLength,
    halfWidth,
    -halfHeight,
    -halfLength,
    halfWidth,
    halfHeight,
    -halfLength,
  ];

  colors = [
    worldColors[0],
    worldColors[1],
    worldColors[2],
    worldColors[0],
    worldColors[1],
    worldColors[2],
    worldColors[0],
    worldColors[1],
    worldColors[2],
    worldColors[0],
    worldColors[1],
    worldColors[2],
    worldColors[0],
    worldColors[1],
    worldColors[2],
    worldColors[0],
    worldColors[1],
    worldColors[2],
    worldColors[0],
    worldColors[1],
    worldColors[2],
    worldColors[0],
    worldColors[1],
    worldColors[2],
  ];

  faces = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 0, 4, 7, 0, 7, 3, 1, 5, 6, 1, 6, 2, 0, 1, 5, 0, 5, 4, 3, 2, 6, 3, 6, 7];

  return { vertices: vertices, colors: colors, faces: faces };
}
