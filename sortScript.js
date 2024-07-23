const activeLayers = app.activeDocument.layers;

if (activeLayers.length > 0) {
    sortLayers(activeLayers);
}

function sortLayers(layers) {

    var layerBuffer = [];

    for (var i = 0; i < activeLayers.length; i++) {
        if (!layers[i].isBackgroundLayer) {
            layerBuffer.push(layers[i]);
        }
    }

    // alert(layerBuffer);
    layerBuffer.sort(function (a, b) { return b.bounds.left - a.bounds.left });
    // alert(layerBuffer);
    layerBuffer.reverse()

    for (var e = 0; e < activeLayers.length; e++) {
        alert("loop", e)
        for (var a = 0; a < layerBuffer.length; a++) {
            layerBuffer[a].move(activeLayers[a], ElementPlacement.PLACEBEFORE)
        }
    }
}