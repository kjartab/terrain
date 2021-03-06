
function Cloud(mapdivelement) {




	Cloud.prototype.panToLeafletObject = function(dbid) {
		geojson.eachLayer(function (layer) {
			if (getCloud().getLeafletDbId(layer) == dbid) {
				layer.setStyle({
					weight: 6,
					fillColor: '#333333',
					color: '#333333',
					fillOpacity: 0.7
				});
				map.panTo(layer.getBounds().getCenter(), {animate : true, duration: 0.5});
			}
		});
	}


	Cloud.prototype.getLeafletDbId = function(leafletobj) {
		return leafletobj.feature.geometry.props.dbid;
	}

	Cloud.prototype.style = function(feature) {
			switch(feature.geometry.type) {
				case 'Polygon':
					return {
						fillColor: "#2233dd",
						weight: 1,
						opacity: 1,
						color: "#2233dd",
						fillOpacity: 0.3
					};
				break;
				
				case 'Point':
					return {
						fillColor: "#2233dd",
						weight: 1,
						opacity: 0.8,
						color: "#2233dd",
						fillOpacity: 0.9
					};
				break;
			}
		}
		

	Cloud.prototype.onEachFeature = function(feature, layer) {
			
			layer.on({
				mouseover: getCloud().highlightFeature,
				mouseout: getCloud().resetHighlight,
				click: getCloud().zoomToFeature
			});
			
		}

	Cloud.prototype.zoomToFeature = function(e) {
		map.fitBounds(e.target.getBounds());
	}

	Cloud.prototype.resetHighlight = function(e) {
		geojson.resetStyle(e.target);
		activePolygon = null;
	}

	Cloud.prototype.highlightFeature = function(e) {

		var layer = e.target;
		switch(layer.feature.geometry.type) {
			case 'Polygon':
				layer.setStyle({
					weight: 1,
					fillColor: "#0A0AD1",
					color: "#3366CC",
					fillOpacity: 0.3
				});
			break;
			
			case 'Point':
				layer.setStyle({
				weight: 4,
				fillColor: "#0A0AD1",
				color: "#3366CC",
				fillOpacity: 0.7
			});
			break;
			
			
		}
		
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}

	
	Cloud.prototype.startViewer = function(outline, table) {
		if(outline != null) {
			
			open("visualize.html?outline="+outline+"&table="+table);
		} else {
			window.alert("No point cloud selected");
		}
	}
	
    Cloud.prototype.toWKT = function(layer) {
		var lng, lat, coords = [];
		
		if (layer instanceof L.Polygon || layer instanceof L.Polyline ) {
			var latlngs = layer.getLatLngs();
			for (var i = 0; i < latlngs.length; i++) {
				latlngs[i]
				coords.push(latlngs[i].lng + " " + latlngs[i].lat);
				if (i === 0) {
					lng = latlngs[i].lng;
					lat = latlngs[i].lat;
				}
			};
			if (layer instanceof L.Polygon) {
				return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
			} else if (layer instanceof L.Polyline) {
				return "LINESTRING(" + coords.join(",") + ")";
			}
		} else if (layer instanceof L.Circle) {
			return "ST_MakePoint(" + layer.getLatLng().lng + "," + layer.getLatLng().lat + ")";
		} else if (layer instanceof L.Marker) {
			return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
		}
	}