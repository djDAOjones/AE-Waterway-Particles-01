var compName = "Water Examples 02 JSX 2";
var comp = null;

for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i) instanceof CompItem && app.project.item(i).name === compName) {
        comp = app.project.item(i);
        break;
    }
}

if (!comp) {
    alert("Composition '" + compName + "' not found.");
} else {
    app.beginUndoGroup("Generate 10 Particles with Path Follow");

    var baseLayer = comp.layer("Base_Particle");
    var totalParticles = 10;
    var spreadDuration = 6.0;

    baseLayer.name = "Particle_1";
    baseLayer.startTime = 0;

    var expr = 
    "try {\n" +
    "  var totalParticles = 10.0;\n" +
    "  var spreadDuration = 6.0;\n" +
    "  var offsetTime = (index / totalParticles) * spreadDuration;\n" +
    "  var t = clamp((time - offsetTime) / spreadDuration, 0, 1);\n" +
    "  var pathLayer = thisComp.layer(\"River path 01\");\n" +
    "  var shape = pathLayer.content(\"Shape 2\");\n" +
    "  var pathGroup = shape ? shape.content(\"Path 1\") : null;\n" +
    "  var pathProp = pathGroup ? pathGroup.path : null;\n" +
    "  if (!pathProp) throw \"No path\";\n" +
    "  var pt = pathProp.pointOnPath(t);\n" +
    "  seedRandom(index, true);\n" +
    "  var amp = random(3, 8);\n" +
    "  var freq = random(0.2, 0.5);\n" +
    "  var phase = random(0, Math.PI * 2);\n" +
    "  var drift = Math.sin((time - offsetTime) * freq * 2 * Math.PI + phase) * amp;\n" +
    "  var dt = 0.001;\n" +
    "  var nextT = clamp(t + dt, 0, 1);\n" +
    "  var nextPt = pathProp.pointOnPath(nextT);\n" +
    "  var dir = nextPt - pt;\n" +
    "  var len = Math.sqrt(dir[0]*dir[0] + dir[1]*dir[1]);\n" +
    "  if (len === 0) throw \"Direction zero\";\n" +
    "  dir = [dir[0]/len, dir[1]/len];\n" +
    "  var perp = [-dir[1], dir[0]];\n" +
    "  var pos = [\n" +
    "    pt[0] + perp[0] * drift + 1920,\n" +
    "    pt[1] + perp[1] * drift + 1200\n" +
    "  ];\n" +
    "  if (!isFinite(pos[0]) || !isFinite(pos[1])) throw \"Invalid result\";\n" +
    "  pos;\n" +
    "} catch (err) {\n" +
    "  [1920, 1200];\n" +
    "}";

    baseLayer.property("Position").expression = expr;

    for (var i = 1; i < totalParticles; i++) {
        var dup = baseLayer.duplicate();
        dup.name = "Particle_" + (i + 1);
        dup.startTime = (i / totalParticles) * spreadDuration;
        dup.property("Position").expression = expr;
    }

    app.endUndoGroup();
}
