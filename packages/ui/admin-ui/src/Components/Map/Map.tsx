import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

import { createMap, createAmplifyGeocoder  } from "maplibre-gl-js-amplify";
import {
  Marker,
  Map,
  NavigationControl,
  AnyPaint
} from 'maplibre-gl';

import useRouteCalculation from "../../hooks/useRouteCalculation";
import MapControls from "./MapControls/MapControls";

import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl-js-amplify/dist/public/amplify-map.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling

import './Map.css';

type MapProps = {

}

type CustomMarker = {
  marker: Marker;
}

const MapComponent: FunctionComponent<MapProps> = (props) => {
  const mapRef = useRef(null); // Reference to the map DOM element
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [markerCounter, setMarkerCounter] = useState(0);
  const [map, setMap] = useState<Map | null>(null);
  const [routeCounter, setRouteCounter] = useState(0);
  const [routesIds, setRoutesIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const drawRoute = (routeCalculationAnswer: any) => {
    if (!map) {
      return;
    }

    let localRouteCounter = routeCounter;

    const { Legs } = routeCalculationAnswer;

    Legs.forEach((leg: any) => {
      localRouteCounter++;

      const coords = leg.Geometry.LineString;

      map.addSource(`route-${localRouteCounter}`, {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': coords
          }
        }
      });

      map.addLayer({
        'id': `route-${localRouteCounter}`,
        'type': 'line',
        'source': `route-${localRouteCounter}`,
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#8cf1e8',
          'line-width': 3
        }
      });

      setRoutesIds(p => [...p, `route-${localRouteCounter}`]);
    });

    setRouteCounter(localRouteCounter);
  }

  const { findBestRoute, buildRoute } = useRouteCalculation();

  const addMarker = (coords: [number, number]) => {
    if (!map) {
      console.error('There is no map: ', map);
      return;
    }
    if (markers.length >= parseInt(process.env.REACT_APP_MAX_MARKERS!)) {
      return;
    }

    const marker = new Marker();

    marker
      .setLngLat(coords)
      .addTo(map);

    console.log('New marker: ', marker.getLngLat());

    const customMarker = {
      marker,
    }

    setMarkers(prevState => [...prevState, customMarker]);
    setMarkerCounter(p => ++p);
  }

  const clearRoutes = () => {
    if (!map) {
      return;
    }
    setRouteCounter(0);

    routesIds.forEach(resId => {
      map.removeLayer(resId);
      map.removeSource(resId);
    });
    setRoutesIds([]);
  }

  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.marker.remove();
    });
    setMarkers([]);
    setMarkerCounter(0);
  }

  const clearMap = () => {
    clearRoutes();
    clearMarkers();
  }

  useEffect(() => {
    if (markers.length > parseInt(process.env.REACT_APP_MAX_MARKERS!)) {
      markers[markers.length - 1].marker.remove();
      setMarkers(p => p.slice(0, p.length - 1));
      setMarkerCounter(p => --p);
    }
  }, [markers]);

  const handleMatrixRequest = () => {
    if (markers.length < 3) {
      return;
    }
    setLoading(true);

    const coords: [number, number][] = [];

    markers.forEach(marker => {
      const markerCoords = marker.marker.getLngLat();
      coords.push([markerCoords.lng, markerCoords.lat]);
    });

    (async () => {
      const bestRoute = await findBestRoute(coords);

      if (bestRoute) {
        drawRoute(await buildRoute(bestRoute.map(coordsPair => {
          if (!coordsPair) {
            throw new Error('bad coords Pair');
          }

          return [coordsPair.getX(), coordsPair.getY()];
        })));
      }

      setLoading(false);
    })();
  }

  useEffect(() => {
    if (map) {
      // Set map event handler
      map.on('click', async (event: any) => {
        const { lngLat } = event;

        addMarker([lngLat.lng, lngLat.lat]);
      });
    }
  }, [map]);

  useEffect(() => {
    let tempMap: any;
    async function initializeMap() {
      // We only want to initialize the underlying maplibre map after the div has been rendered
      if (mapRef.current != null) {
        tempMap = await createMap({
          container: mapRef.current,
          center: [73.4, 54.97],
          // center: [-122.486052, 37.830348],
          zoom: 12,
        });

        // TODO: Configure geo https://docs.amplify.aws/cli/geo/search/
        tempMap.addControl(createAmplifyGeocoder());

        tempMap.addControl(new NavigationControl(), "bottom-left");

        setMap(tempMap);

        // Route drawing
        // tempMap.on('load', function () {
        //   // tempMap.addSource('route', {
        //   //   'type': 'geojson',
        //   //   'data': {
        //   //     'type': 'Feature',
        //   //     'properties': {},
        //   //     'geometry': {
        //   //       'type': 'LineString',
        //   //       'coordinates': [
        //   //         [73.36390023034562, 54.99128730834794],
        //   //         [73.36390022412039, 54.991287308742415],
        //   //         [73.36365001335949, 54.99116999255551],
        //   //         [73.3638600141169, 54.99102999205058],
        //   //         [73.36435001588414, 54.99106999707529],
        //   //         [73.36476000760197, 54.99118000235247],
        //   //         [73.36476000465947, 54.9911800029038],
        //   //         [73.36526999798292, 54.99130000937294],
        //   //         [73.36635999979362, 54.9912499838972],
        //   //         [73.36709001636729, 54.99122999420914],
        //   //         [73.36831000240593, 54.991210004521086],
        //   //         [73.36978999107093, 54.99116999097457],
        //   //         [73.37001999207999, 54.99116999097457],
        //   //         [73.37204000985611, 54.991109987739996],
        //   //         [73.37273999064209, 54.99108999805195],
        //   //         [73.37301998295648, 54.99107000836389],
        //   //         [73.3735900136849, 54.99078000412027],
        //   //         [73.37370998598364, 54.99065999765113],
        //   //         [73.37416001024292, 54.99010001302234],
        //   //         [73.37448999386265, 54.98966000069229],
        //   //         [73.37479001003551, 54.98927999159682],
        //   //         [73.37491001650464, 54.98912998351039],
        //   //         [73.37557999567335, 54.98830999625527],
        //   //         [73.37597999445687, 54.987819992619876],
        //   //         [73.37653000132684, 54.98714000152195],
        //   //         [73.37763999282558, 54.985660012856954],
        //   //         [73.37809001708486, 54.98509001629894],
        //   //         [73.37851000555645, 54.98463999203966],
        //   //         [73.3787799859416, 54.9843700116545],
        //   //         [73.379269989577, 54.983889985777935],
        //   //         [73.38014000230787, 54.98308001045204],
        //   //         [73.38027999846507, 54.98293000236562],
        //   //         [73.38038999300498, 54.98274001490308],
        //   //         [73.38038999595183, 54.98274000546658],
        //   //         [73.38042994117937, 54.98172398203141]
        //   //       ]
        //   //     }
        //   //   }
        //   // });
        //
        // });


      }
    }
    initializeMap();

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (tempMap != null) tempMap.remove();
    };
  }, []);


  return <div className="map_wrapper">
    <div className={`map__loading_bar ${loading ? 'active' : ''}`} />
    <div ref={mapRef} id="map" className="fullheight-map" />
    <MapControls
      clearMap={clearMap}
      markerCounter={markerCounter}
      routeCalculate={handleMatrixRequest}
    />
  </div>
}

export default MapComponent;
