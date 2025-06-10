
// After Effects Script: Get Path Length from Shape Layer or Null

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
    var path;

    try {
        // Try "River path 01"
        if (layer.name === "River path 01") {
            path = layer
                .property("Contents")
                .property("Shape 2") // Adjust as needed
                .property("Contents")
                .property("Path 1")
                .property("Path")
                .value;
        } else if (layer.name === "Trace_Null") {
            // If Trace_Null is selected, try to follow pick-whip expression
            var refLayer = comp.layer("River path 01");
            path = refLayer
                .property("Contents")
                .property("Shape 2")
                .property("Contents")
                .property("Path 1")
                .property("Path")
                .value;
        } else {
            throw "Layer not recognised as a shape or known null.";
        }

        alert("Path length in pixels: " + path.length);
    } catch (err) {
        alert("Error accessing path: " + err.toString());
    }
})();
