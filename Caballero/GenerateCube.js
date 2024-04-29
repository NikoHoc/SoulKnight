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