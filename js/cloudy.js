
function Cloud(mapdivelement) {

	map = L.map(mapdivelement).setView([56.9648487562327, 1.8675290264099], 8);
	
		//	map.addLayer(L.tileLayer.wms("http://opencache.statkart.no/gatekeeper/gk/gk.open?",{layers: 'topo2graatone', format: 'image/png'},{attribution:''}));
	map.addLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}));
	
	geojson = L.geoJson(null,{onEachFeature: this.onEachFeature, style : this.style}).addTo(map);
	
	drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);
	
	drawControl = new L.Control.Draw({
			edit: { featureGroup: drawnItems },
			position: 'bottomright'
		});
	map.addControl(drawControl);
	
	map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;

		if (type === 'marker') {
		//	K.startViewer(K.toWKT(e.layer),-1,'buffer',-1);
		}
		
		if (type === 'rectangle' || type === 'polygon') {
			getCloud().startViewer(getCloud().toWKT(e.layer),'sunnfjordterrain');
		}
		
		if (type === 'circle') {
		//	K.startViewer(K.toWKT(e.layer),-1,'circle',layer._mRadius);
			
		}
		map.addLayer(layer);
	});
	
}

	Cloud.prototype.addMapObject = function(item, list) {
		this.addGeoJson(item);
		this.addToList(list, item.props.name, item.props.dbid);
	}

	Cloud.prototype.addGeoJson = function(jsonobject) {	
		geojson.addData(jsonobject, {onEachFeature: getCloud().onEachFeature, style : getCloud().style});
	}

	Cloud.prototype.addToList = function(listdiv, name, dbid) {
		
		var anchor = document.createElement("a");
		anchor.className+=" list-group-item";
		anchor.innerHTML = name;
		anchor.dbid = dbid;
		anchor.onclick = function() { getCloud().panToLeafletObject(dbid) };
		listdiv.append(anchor);
	}



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
			open("vis.html?outline="+outline+"&table="+table);
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