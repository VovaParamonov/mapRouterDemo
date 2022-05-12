import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

import { createMap, createAmplifyGeocoder  } from 'maplibre-gl-js-amplify';
import {
  Marker,
  Map,
  NavigationControl,
  AnyPaint
} from 'maplibre-gl';

import useRouteCalculation from '../../hooks/useRouteCalculation';
import MapControls from './MapControls/MapControls';

import 'maplibre-gl/dist/maplibre-gl.css';
import 'maplibre-gl-js-amplify/dist/public/amplify-map.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import 'maplibre-gl-js-amplify/dist/public/amplify-geocoder.css'; // Optional CSS for Amplify recommended styling

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
      if (mapRef.current != null) {
        tempMap = await createMap({
          container: mapRef.current,
          center: [73.4, 54.97],
          zoom: 12,
        });

        // TODO: Configure geo https://docs.amplify.aws/cli/geo/search/
        tempMap.addControl(createAmplifyGeocoder());

        tempMap.addControl(new NavigationControl(), 'bottom-left');

        setMap(tempMap);
      }
    }
    initializeMap();

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (tempMap != null) tempMap.remove();
    };
  }, []);


  return <div className='map_wrapper'>
    <div className={`map__loading_bar ${loading ? 'active' : ''}`} />
    <div ref={mapRef} id='map' className='fullheight-map' />
    <MapControls
      clearMap={clearMap}
      markerCounter={markerCounter}
      routeCalculate={handleMatrixRequest}
    />
  </div>
}

export default MapComponent;
