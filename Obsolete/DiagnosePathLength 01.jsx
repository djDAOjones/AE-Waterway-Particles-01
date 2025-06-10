
// AE Script: Diagnose and get Shape Path Length

(function () {
    var comp = app.project.activeItem;
    if (!comp || !(comp instanceof CompItem)) {
        alert("Please select a composition.");
        return;
    }

    var selected = comp.selectedLayers;
    if (selected.length === 0) {
        alert("Select a shape layer or its associated null.");
        return;
    }

    var layer = selected[0];
    var path, pathType;

    try {
        var shapeGroup = layer
            .property("Contents")
            .property("Shape 2") // Adjust if needed
            .property("Contents")
            .property("Path 1");

        if (!shapeGroup || !shapeGroup.property("Path")) {
            throw "Path property not found. Check shape structure.";
        }

        path = shapeGroup.property("Path").value;
        pathType = typeof path;

        if (path && path.vertices) {
            if (typeof path.length !== "undefined") {
                alert("Path length in pixels: " + path.length);
            } else {
                alert("Path object found, but .length is undefined. Is the path animated or expression-driven?");
            }
        } else {
            alert("Retrieved value is not a valid Shape path. Type: " + pathType);
        }
    } catch (err) {
        alert("Error accessing path: " + err.toString());
    }
})();
