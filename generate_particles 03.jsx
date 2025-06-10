// === Setup Parameters ===
var numberOfParticles = 5;
var animationDuration = 10; // in seconds

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

        // Log parent assignment
        $.writeln("Created particle: " + newParticle.name + " parented to: " + newParticle.parent.name);

        // Update Expressions in Trace_Null
        var newPathName = newPath.name;

        var tracePosProp = newTrace.property("Transform").property("Position");
        if (tracePosProp.expressionEnabled) {
            var posExpr = tracePosProp.expression;
            tracePosProp.expression = posExpr.replace(/"River_Path_0001"/g, '"' + newPathName + '"');
        }

        var traceRotProp = newTrace.property("Transform").property("Rotation");
        if (traceRotProp.expressionEnabled) {
            var rotExpr = traceRotProp.expression;
            traceRotProp.expression = rotExpr.replace(/"River_Path_0001"/g, '"' + newPathName + '"');
        }

        // Inject looping expression into Trace Path Progress
        var effects = newTrace.property("Effects");
        var tracePathEffect = effects.property(1); // safer than by name
        var progressProp = tracePathEffect.property(1); // typically Progress

        if (progressProp) {
            var expr =
                "var animDuration = " + animationDuration + ";\n" +
                "var offset = (" + i + ") / " + numberOfParticles + ";\n" +
                "var localTime = (time + offset * animDuration) % animDuration;\n" +
                "var cycleTime = animDuration / 2;\n" +
                "var phase = localTime % cycleTime;\n" +
                "linear(phase, 0, cycleTime, 0, 99.999);";
            progressProp.expression = expr;
        }

        // Test visibility with static position
        var testExpr = "[thisComp.width/2, thisComp.height/2];";
        newParticle.property("Transform").property("Position").expression = testExpr;

        // Parent particle to its corresponding Trace_Null
        newParticle.parent = newTrace;
    }
}

app.endUndoGroup();
