  //base map w/context menu
  var map = L.map('map', {
    continuousWorld: false,
    noWrap: true,
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
      text: 'Show coordinates',
      callback: showCoordinates
    }, {
      text: 'Place Marker',
      callback: showMarker
    }, {
      text: 'Remove Marker',
      callback: removeMarker
    }, {
      text: 'Center map here',
      callback: centerMap
    }, '-', {
      text: 'Zoom in',
      icon: 'css/images/zoom-in.png',
      callback: zoomIn
    }, {
      text: 'Zoom out',
      icon: 'css/images/zoom-out.png',
      callback: zoomOut
    }]
  });

  var center = L.latLng(37.76, -87.33);
  var marker;
  var initZoom = 4;
  var currRadius = 3;
  mapLink = '<a href="http://www.esri.com/">ESRI</a>';
  creditLink = 'DeLorme, HERE, USGS, Intermap, increment P Corp, TomTom';

  //ESRI tiles
  var EsriStreet = new L.tileLayer('http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}?', {
    tms: false,
    attribution: '&copy; ' + mapLink + ', ' + creditLink
  });
  map.addLayer(EsriStreet).setView(center, initZoom);

  var xMarker = L.AwesomeMarkers.icon({
    icon: 'times',
    markerColor: 'darkblue',
    prefix: 'fa'
  });

  marker = L.marker(new L.LatLng(0, 0), {
    draggable: true,
    zIndexOffset: 999,
    icon: xMarker
  });

  //add sidebar
  var sidebar = L.control.sidebar('sidebar').addTo(map);

  //noaa logo credit
  L.controlCredits({
    image: "css/images/noaa-logo.png",
    link: "http://www.ngs.noaa.gov/",
    text: "NGSmap by<br/>NOAA NGS",
    width: 46,
    height: 44
  }).addTo(map);

  //geoid tiles
  var geoid12b_as = L.tileLayer('tiles/geoid12b_as/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var geoid12b_na = L.tileLayer('tiles/geoid12b_na/{z}/{x}/{y}.png', {
    maxZoom: 7,
    opacity: 0.8
  });
  var geoid12b_gu = L.tileLayer('tiles/geoid12b_gu/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var geoid12b_hi = L.tileLayer('tiles/geoid12b_hi/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var geoid12b_prvi = L.tileLayer('tiles/geoid12b_prvi/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var geoid12b = L.layerGroup([geoid12b_as, geoid12b_na, geoid12b_gu, geoid12b_hi, geoid12b_prvi]).addTo(map);

  var xgeoid15 = L.tileLayer('tiles/xgeoid15/{z}/{x}/{y}.png', {
    maxZoom: 7
  });

  //deflec tiles
  var deflec12b_as_eta = L.tileLayer('tiles/deflec12b_as_eta/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_na_eta = L.tileLayer('tiles/deflec12b_na_eta/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_gu_eta = L.tileLayer('tiles/deflec12b_gu_eta/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_hi_eta = L.tileLayer('tiles/deflec12b_hi_eta/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_pr_eta = L.tileLayer('tiles/deflec12b_pr_eta/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_eta = L.layerGroup([deflec12b_as_eta, deflec12b_na_eta, deflec12b_gu_eta, deflec12b_hi_eta, deflec12b_pr_eta]);

  var deflec12b_as_xi = L.tileLayer('tiles/deflec12b_as_xi/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_na_xi = L.tileLayer('tiles/deflec12b_na_xi/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_gu_xi = L.tileLayer('tiles/deflec12b_gu_xi/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_hi_xi = L.tileLayer('tiles/deflec12b_hi_xi/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_pr_xi = L.tileLayer('tiles/deflec12b_pr_xi/{z}/{x}/{y}.png', {
    maxZoom: 7
  });
  var deflec12b_xi = L.layerGroup([deflec12b_as_xi, deflec12b_na_xi, deflec12b_gu_xi, deflec12b_hi_xi, deflec12b_pr_xi]);

  function showCoordinates(e) {
    alert(e.latlng);
  }

  function centerMap(e) {
    map.panTo(e.latlng);
  }

  function zoomIn(e) {
    map.zoomIn();
  }

  function zoomOut(e) {
    map.zoomOut();
  }

  function showMarker(e) {
    marker.addTo(map);
    marker.setLatLng(e.latlng);
    map.panTo(e.latlng).setZoom(11);
    updateMarker();
  }

  function showCenterMarker() {
    center = map.getCenter();
    marker.addTo(map);
    marker.setLatLng(center);
    map.panTo(center).setZoom(11);
    updateMarker();
  }

  function removeMarker(e) {
    if (map.hasLayer(marker)) {
      $('path').remove();
      $('.leaflet-marker-pane *').not(':first').remove();
      map.removeLayer(marker);
    }
  }

  function updateRadius(rad) {
    currRadius = rad;
  }

  function pointBuffer(pt, radius, units, resolution) {
    var ring = []
    var resMultiple = 360 / resolution;
    for (var i = 0; i < resolution; i++) {
      var spoke = turf.destination(pt, radius, i * resMultiple, units);
      ring.push(spoke.geometry.coordinates);
    }
    if ((ring[0][0] !== ring[ring.length - 1][0]) && (ring[0][1] != ring[ring.length - 1][1])) {
      ring.push([ring[0][0], ring[0][1]]);
    }
    return turf.polygon([ring])
  }

  function styleBuffer(feature) {
    return {
      color: '#062c4f',
      weight: 2,
      fillOpacity: 0.3,
      fillColor: "#0b508e"
    }
  }

  function updateMarker() {
    $('path').remove();
    //$('.leaflet-marker-pane *').not(':first').remove();
    //if(map.hasLayer(bufferLayer)){
    //       bufferLayer.clearLayers();
    // }

    var position = marker.getLatLng();
    var point = turf.point(position.lng, position.lat);
    //draw buffer
    var bufferLayer = L.geoJson(null, {
      style: styleBuffer
    }).addTo(map);
    var buffer = pointBuffer(point, currRadius, 'miles', 120);
    bufferLayer.addData(buffer);

    //debug
    console.log('The marker coordinates are: ', position.lat.toFixed(5), position.lng.toFixed(5));

  }

  marker.on('drag', function() {
    updateMarker()
  });


  function getPID(val) {
    $.ajax({
      type: "GET",
      crossOrigin: true,
      proxy: "http://localhost:8888/2015-webdev/ngsmap/proxy.php",
      url: "http://beta.ngs.noaa.gov/controlws/pid?pid=" + val,
      contentType: "application/json",
      success: function(data)

      {
        if (data.length > 2 && data !== null) {
          pidattrs = JSON.parse(data);
          pidlat = pidattrs[0].lat;
          pidlon = pidattrs[0].lon;
          pidname = pidattrs[0].name;
          pidid = pidattrs[0].pid;

          removeMarker();
          marker.addTo(map);
          marker.setLatLng([pidlat, pidlon]);
          map.panTo([pidlat, pidlon]).setZoom(11);
          marker.bindPopup('<b>PID:</b> ' + pidid + '<br><b>Lat:</b> ' + pidlat + '<br><b>Lon:</b> ' + pidlon + '<br><b>Name:</b> ' + pidname).openPopup();

        } else {
          //$("#alertModal").modal('show');
          console.log('No PID found!');
        }
      },
      error: function(data) {
        console.log('error', data);
      }

    });

  }

  $(document).ready(function() {


    //jquery checkbox stuff. only allow one active layer at a time

    $('input[id="geoid12b"]').click(function(event) {

      if ($('input[id="geoid12b"]').is(':checked')) {

        map.addLayer(geoid12b);

        $('input[id="xgeoid15"]').prop('checked', false);
        $('input[id="deflec12b_eta"]').prop('checked', false);
        $('input[id="deflec12b_xi"]').prop('checked', false);

        if (map.hasLayer(xgeoid15)) {
          map.removeLayer(xgeoid15)
        }
        if (map.hasLayer(deflec12b_eta)) {
          map.removeLayer(deflec12b_eta)
        }
        if (map.hasLayer(deflec12b_xi)) {
          map.removeLayer(deflec12b_xi)
        }
      }
      if (!$('input[id="geoid12b"]').is(':checked')) {

        map.removeLayer(geoid12b);
      }
    });

    $('input[id="xgeoid15"]').click(function(event) {

      if ($('input[id="xgeoid15"]').is(':checked')) {

        map.addLayer(xgeoid15);

        $('input[id="geoid12b"]').prop('checked', false);
        $('input[id="deflec12b_eta"]').prop('checked', false);
        $('input[id="deflec12b_xi"]').prop('checked', false);

        if (map.hasLayer(geoid12b)) {
          map.removeLayer(geoid12b)
        }
        if (map.hasLayer(deflec12b_eta)) {
          map.removeLayer(deflec12b_eta)
        }
        if (map.hasLayer(deflec12b_xi)) {
          map.removeLayer(deflec12b_xi)
        }

      }
      if (!$('input[id="xgeoid15"]').is(':checked')) {

        map.removeLayer(xgeoid15);

      }
    });

    $('input[id="deflec12b_eta"]').click(function(event) {

      if ($('input[id="deflec12b_eta"]').is(':checked')) {

        map.addLayer(deflec12b_eta);

        $('input[id="geoid12b"]').prop('checked', false);
        $('input[id="xgeoid15"]').prop('checked', false);
        $('input[id="deflec12b_xi"]').prop('checked', false);

        if (map.hasLayer(geoid12b)) {
          map.removeLayer(geoid12b)
        }
        if (map.hasLayer(xgeoid15)) {
          map.removeLayer(xgeoid15)
        }
        if (map.hasLayer(deflec12b_xi)) {
          map.removeLayer(deflec12b_xi)
        }

      }
      if (!$('input[id="deflec12b_eta"]').is(':checked')) {

        map.removeLayer(deflec12b_eta);

      }
    });

    $('input[id="deflec12b_xi"]').click(function(event) {

      if ($('input[id="deflec12b_xi"]').is(':checked')) {

        map.addLayer(deflec12b_xi);

        $('input[id="geoid12b"]').prop('checked', false);
        $('input[id="xgeoid15"]').prop('checked', false);
        $('input[id="deflec12b_eta"]').prop('checked', false);

        if (map.hasLayer(geoid12b)) {
          map.removeLayer(geoid12b)
        }
        if (map.hasLayer(xgeoid15)) {
          map.removeLayer(xgeoid15)
        }
        if (map.hasLayer(deflec12b_eta)) {
          map.removeLayer(deflec12b_eta)
        }

      }
      if (!$('input[id="deflec12b_xi"]').is(':checked')) {

        map.removeLayer(deflec12b_xi);
      }
    });

    //opacity sliders
    $("#geoidhtslider").slider({
      value: 100,
      slide: function(e, ui) {
        if (map.hasLayer(geoid12b)) {
          geoid12b.eachLayer(function(layer) {
            layer.setOpacity(ui.value / 100);
          });
        }
      }
    });
    //value on pageload
    $("#geoidhtslider").slider({
      value: 80
    });

    $("#deflec12b_etaslider").slider({
      value: 100,
      slide: function(e, ui) {
        if (map.hasLayer(deflec12b_eta)) {
          deflec12b_eta.eachLayer(function(layer) {
            layer.setOpacity(ui.value / 100);
          });
        }
      }
    });

    $("#deflec12b_xislider").slider({
      value: 100,
      slide: function(e, ui) {
        if (map.hasLayer(deflec12b_xi)) {
          deflec12b_xi.eachLayer(function(layer) {
            layer.setOpacity(ui.value / 100);
          });
        }
      }
    });

    $("#xgeoid15slider").slider({
      value: 100,
      slide: function(e, ui) {
        if (map.hasLayer(xgeoid15)) {
          xgeoid15.setOpacity(ui.value / 100);
        }
      }
    });

    //marker buttons
    $(".appbutton").css({
      'font-size': '12px'
    });

    $("#rmMarker").button().click(function(e) {
      e.preventDefault();
      removeMarker();
    });

    $("#plMarker").button().click(function(e) {
      e.preventDefault();
      showCenterMarker();
    });

    //search rad menu
    $("#radNumber").selectmenu({
      change: function(event, ui) {
        updateRadius(ui.item.value);
        updateMarker();
      }
    });

    //pid search

    $('#pidsearch-label').keydown(function() {

      if (event.keyCode == 13) {
        $('#pidsearch').submit();
        var pid = $('#pidsearch').val();

        if (pid) {
          getPID(pid);
        } else {
          //$("#alertModal").modal('show');
          console.log('no pid found');
        }

        return false;
      }

    });

    //geocoder
    var geocoder = L.Control.geocoder({
      collapsed: false,
      placeholder: 'Search Location...',
      geocoder: L.Control.Geocoder.bing('Ai2OLPZ0XkZFZX2ZNNTDfWDJcpPQS1yAGh2h8GA0_C2k1aPb1u_fn3ljo49TSqZD')
    });

    geocoder._map = map;
    var geocoderDiv = geocoder.onAdd(map);

    //uncomment for geocoder on map
    //geocoder.addTo(map);

    document.getElementById('geocoderSidebar').appendChild(geocoderDiv);

    geocoder.markGeocode = function(result) {

      var geocoderCenter = result.center;
      marker.addTo(map);
      marker.setLatLng(geocoderCenter);
      map.panTo(geocoderCenter).setZoom(11);
      updateMarker();

    };

    //debugging zoom levels
    function onZoomend() {
      var currentZoom = map.getZoom();
      console.log('Zoom level is: ' + currentZoom);
    };
    map.on('zoomend', onZoomend);

  }); //end doc ready