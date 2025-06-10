// === Setup Parameters ===
var numberOfParticles = 5;
var animationDuration = 10;

app.beginUndoGroup("Duplicate Particle Flow");

var comp = app.project.activeItem;
if (!comp || !(comp instanceof CompItem)) {
    alert("Please select an active composition.");
} else {
    var basePath = comp.layer("River_Path_0001");
    var baseTrace = comp.layer("River_Path_0001_Trace_Null");
    var baseParticle = comp.layer("River_Path_0001_Particle");

    for (var i = 1; i <= numberOfParticles; i++) {
        var suffix = ("000" + (i + 1)).slice(-4);

        // Duplicate layers
        var newPath = basePath.duplicate();
        var newTrace = baseTrace.duplicate();
        var newParticle = baseParticle.duplicate();

        newPath.moveToBeginning();
        newTrace.moveToBeginning();
        newParticle.moveToBeginning();

        // Rename
        newPath.name = "River_Path_" + suffix;
        newTrace.name = "River_Path_" + suffix + "_Trace_Null";
        newParticle.name = "River_Path_" + suffix + "_Particle";

        // --- Update Expressions ---
        var newPathName = newPath.name;

        // Position Expression
        var tracePosProp = newTrace.property("Transform").property("Position");
        if (tracePosProp.expressionEnabled) {
            var posExpr = tracePosProp.expression;
            tracePosProp.expression = posExpr.replace(/"River_Path_0001"/g, '"' + newPathName + '"');
        }

        // Rotation Expression
        var traceRotProp = newTrace.property("Transform").property("Rotation");
        if (traceRotProp.expressionEnabled) {
            var rotExpr = traceRotProp.expression;
            traceRotProp.expression = rotExpr.replace(/"River_Path_0001"/g, '"' + newPathName + '"');
        }

        // --- Offset Trace Progress ---
        var effects = newTrace.property("Effects");
        var tracePathEffect = effects.property(1); // safer than assuming name
        var progressProp = tracePathEffect.property(1); // typically first param is progress

        if (progressProp && progressProp.numKeys > 0) {
            var keys = [];
            for (var k = 1; k <= progressProp.numKeys; k++) {
                keys.push({ time: progressProp.keyTime(k), value: progressProp.keyValue(k) });
            }

            while (progressProp.numKeys > 0) progressProp.removeKey(1);

            for (var k = 0; k < keys.length; k++) {
                var t = keys[k].time - ((animationDuration / numberOfParticles) * i);
                if (t < 0) t += animationDuration;
                progressProp.setValueAtTime(t, keys[k].value);
            }
        }

        // --- Reassign Particle Parent ---
        newParticle.parent = newTrace;
    }
}

app.endUndoGroup();
