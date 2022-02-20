import React, { FunctionComponent, useEffect, useRef } from 'react';
import { createMap, createAmplifyGeocoder  } from "maplibre-gl-js-amplify";
import "maplibre-gl/dist/maplibre-gl.css";
import "maplibre-gl-js-amplify/dist/public/amplify-map.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css"; // Optional CSS for Amplify recommended styling
import './Map.css';
import useRouteCalculation from "../hooks/useRouteCalculation";

type MapProps = {

}

const Map: FunctionComponent<MapProps> = (props) => {
  const mapRef = useRef(null); // Reference to the map DOM element

  // Wrapping our code in a useEffect allows us to run initializeMap after the div has been rendered into the DOM
  useEffect(() => {
    let map: any;
    async function initializeMap() {
      // We only want to initialize the underlying maplibre map after the div has been rendered
      if (mapRef.current != null) {
        map = await createMap({
          container: mapRef.current,
          center: [73.4, 54.97],
          zoom: 12,
        });

        // TODO: Configure geo https://docs.amplify.aws/cli/geo/search/
        map.addControl(createAmplifyGeocoder());
      }
    }
    initializeMap();

    // Cleans up and maplibre DOM elements and other resources - https://maplibre.org/maplibre-gl-js-docs/api/map/#map#remove
    return function cleanup() {
      if (map != null) map.remove();
    };
  }, []);

  useRouteCalculation();

  return <div ref={mapRef} id="map" className="fullheight-map" />;
}

export default Map;
