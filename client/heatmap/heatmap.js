Template.heatmap.helpers({
  mapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      return {
        center: new google.maps.LatLng(60.171, 24.939),
        zoom: 6,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        scrollwheel: false,
        styles: [
				    {
				        "featureType": "all",
				        "elementType": "labels.text.fill",
				        "stylers": [
				            {
				                "saturation": 36
				            },
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": "48"
				            },
				            {
				                "gamma": "1"
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.icon",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": "20"
				            },
				            {
				                "gamma": "1"
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": "17"
				            },
				            {
				                "weight": 1.2
				            },
				            {
				                "gamma": "1"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": "21"
				            },
				            {
				                "gamma": "1"
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": "23"
				            },
				            {
				                "gamma": "1"
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 17
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 29
				            },
				            {
				                "weight": 0.2
				            }
				        ]
				    },
				    {
				        "featureType": "road.arterial",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": "15"
				            },
				            {
				                "gamma": "1"
				            }
				        ]
				    },
				    {
				        "featureType": "road.local",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": "15"
				            },
				            {
				                "gamma": "1"
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#1f1f1f"
				            }
				        ]
				    }
				]
      };
    }
  }
});

Template.heatmap.onRendered(function() {

	GoogleMaps.load({
		key: 'AIzaSyDHgUmV9jAYLbEEielsh9kGHB23wfhpmT4',
		libraries: 'places,visualization',
	});

  GoogleMaps.ready('heatmap', function(heatmap) {

  	var codes = Session.get('subset');
  	var points = [];
  	_.each(codes, function(code){
  		console.log(code);
  		for (var i=0; i<code.density; i++){
  			points.push(new google.maps.LatLng(parseFloat(code.lat), parseFloat(code.long)));
  		}
  	});
    var pointArray = new google.maps.MVCArray(points);
      
    var heatMapLayer = new google.maps.visualization.HeatmapLayer({
        data: pointArray,
        radius: 20
    });
    
    heatMapLayer.setMap(heatmap.instance);
  });
});

Template.heatmap.events({
	'click .button-matches-js': function(e, instance){
		e.preventDefault();
		Session.set('matches', true);
	}
});
