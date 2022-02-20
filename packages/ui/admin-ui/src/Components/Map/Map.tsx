import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

import { createMap, createAmplifyGeocoder  } from "maplibre-gl-js-amplify";
import {
  Marker,
  Map,
  NavigationControl
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

    console.log('New marker: ', coords);

    const customMarker = {
      marker,
    }

    setMarkers(prevState => [...prevState, customMarker]);
    setMarkerCounter(p => ++p);
  }

  const clearMarkers = () => {
    markers.forEach(marker => {
      marker.marker.remove();
    });
    setMarkers([]);
    setMarkerCounter(0);
  }

  useEffect(() => {
    if (markers.length > parseInt(process.env.REACT_APP_MAX_MARKERS!)) {
      markers[markers.length - 1].marker.remove();
      setMarkers(p => p.slice(0, p.length - 1));
      setMarkerCounter(p => --p);
    }
  }, [markers]);

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
          zoom: 12,
        });

        // TODO: Configure geo https://docs.amplify.aws/cli/geo/search/
        tempMap.addControl(createAmplifyGeocoder());

        tempMap.addControl(new NavigationControl(), "bottom-left");

        setMap(tempMap);
      }
    }
    initializeMap();

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (tempMap != null) tempMap.remove();
    };
  }, []);

  useRouteCalculation();

  return <div className="map_wrapper">
    <div ref={mapRef} id="map" className="fullheight-map" />
    <MapControls markersClear={clearMarkers} markerCounter={markerCounter} />
  </div>
}

export default MapComponent;
