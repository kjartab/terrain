   
    
    var kartan = kartan || {};
    
    
    (function(ns) {
        
        ns.map = function(map) {
            
        }
    
    })(kartan);
    
    
    
    
    (function (ns) {
        
        
        function getDrawControl() {
            return new L.Control.Draw({
                position: 'bottomleft',
                draw: {
                    polyline: false,
                    polygon: {
                        allowIntersection: false,
                        showArea: true,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: false,
                    marker: false
                },
                edit: false
            });        
        }

        
        ns.selection = L.Class.extend({

            includes: L.Mixin.Events,
            map: null,
            btn: false,
            isDisabled: false,
            isDrawing: false,
            isActive: false,

            initialize: function(map, drawnItems) {
                this.map = map;
                this.btn = L.easyButton('fa-stop', _.bind(this.toggleDraw, this), 'Finn eiendommer', this.map);
                this.map.on('zoomend', this.toggleDisabled, this);
                this.map.on('draw:drawstart', this.drawstart, this);
                this.map.on('draw:drawstop', this.drawstop, this);
                this.map.on('draw:created', this.featureDrawn, this);
                this.drawnItems = drawnItems;
                this.drawControl = getDrawControl();
                this.toggleDisabled();
            }
        
            
            drawstart: function () {
                this.isDrawing = true;
                this.drawnItems.clearLayers();
            },

            drawstop: function () {
                this.isDrawing = false;
            },

            featureDrawn: function (e) {
                var layer = e.layer;
                this.drawnItems.addLayer(layer);
                var wktString = wellknown.stringify(layer.toGeoJSON());
                //this.getPropertiesForGeometry(wktString);
                this.fire('geometrySearch', { geom: wktString, BufferRadius: 0 });
            }       
    
    })(kartan);
    
    