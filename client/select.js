
    var select = (function() {
        
        var map;
        var drawnItmes;
        var enabled = false;
        var rectangleDrawer;
        var selection; 
        var onDrawCompleteCallback;
        
        function init(map) {
            map = map;
            
            drawnItems = new L.FeatureGroup().addTo(map);
            rectangleDrawer = new L.Draw.Rectangle(map);
            
            map.addLayer(drawnItems);
            map.on('draw:created', function(event) {
                if (event.layerType === 'rectangle') {
                    if (onDrawCompleteCallback !== null) {
                        selection = event.layer;
                        drawnItems.addLayer(selection);
                        onDrawCompleteCallback(event);
                    }
                }
            });
            
        }
        
        function getSelection() {
            return selection;
        }
        
        function enable() {
            drawnItems.clearLayers();
            rectangleDrawer.enable();
            enabled = true;
        }
        
        function disable() {
            rectangleDrawer.disable();
            enabled = false;
        }
        
        function clearLayers() {
            drawnItems.clearLayers();
            selection = null;
            if (isEnabled()) {
                disable();
            }
        }
        
        function isEnabled() {
            return enabled;
        }
        
        function setOnDrawCompletedCallback(callback) {
            onDrawCompleteCallback = callback;
        }
        
        return {
            init : init,
            getSelection: getSelection,
            enable : enable,
            disable : disable,
            destroy : clearLayers,
            isEnabled : isEnabled,
            drawnCallback : setOnDrawCompletedCallback
        }
    })();
    