function generateWeapon(x, y, z, outerRadius, innerRadius, height, segments, color) {
    var vertices = [];
    var colors = [];

    var angleIncrement = (2 * Math.PI) / segments;

    // Rotate angle by -90 degrees around the x-axis to make the drawing face the opposite direction
    var rotateAngle = -Math.PI / 2;

    for (var i = segments; i >= 0; i--) {
        var angle = i * angleIncrement;
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);

        var outerX = x + outerRadius * cosAngle;
        var outerY = y + outerRadius * sinAngle; // Adjust y-coordinate to apply rotation
        var innerX = x + innerRadius * cosAngle;
        var innerY = y + innerRadius * sinAngle; // Adjust y-coordinate to apply rotation

        // Rotate coordinates by -90 degrees around the x-axis
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
  