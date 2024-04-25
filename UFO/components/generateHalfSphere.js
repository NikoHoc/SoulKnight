export function generateHalfSphere(x, y, z, radius, segments, color) {
    var vertices = [];
    var colors = [];

    var angleIncrement = Math.PI / segments;

    // Adjust the rotation angle by another 90 degrees
    var rotateAngle = Math.PI / 2;

    // Generate vertices for the half sphere
    for (var i = 0; i <= segments / 2; i++) {
        var theta = i * angleIncrement;
        var cosTheta = Math.cos(theta + rotateAngle);
        var sinTheta = Math.sin(theta + rotateAngle);

        for (var j = 0; j <= segments; j++) {
            var phi = j * 2 * Math.PI / segments;
            var cosPhi = Math.cos(phi);
            var sinPhi = Math.sin(phi);

            var xCoord = x + radius * cosTheta * cosPhi;
            var yCoord = y + radius * sinTheta;
            var zCoord = z + radius * cosTheta * sinPhi;

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


