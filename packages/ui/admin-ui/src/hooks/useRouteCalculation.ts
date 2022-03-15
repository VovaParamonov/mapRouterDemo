import React, { useContext, useEffect } from 'react';
import { getDistanceMatrix, buildRoute as buildRoutBase } from "../api/routeCalc";
import { LoginContext } from "../api/LoginContext";
import { findBestRoute } from '../api/multyRoute';

const useRouteCalculation = () => {
  const { awsLocationClient } = useContext(LoginContext);

  const findRoute = async (coords: [number, number][]) => {
    const distanceMatrix = await getDistanceMatrix(awsLocationClient)(coords);

    if (!distanceMatrix) {
      console.error('There is no matrix');
      return;
    }

    const processedMatrix = distanceMatrix.RouteMatrix
      .map(matrixRow => matrixRow.map(matrixElem => {
        if (!matrixElem.Distance) {
          console.error('Found undefiendDistance: ', matrixElem);
          return 0;
        }

        return matrixElem.Distance;
      }));

    const bestRoute = await findBestRoute(coords, processedMatrix);

    console.log('Found best route: ', bestRoute);

    return bestRoute;
  }

  const buildRoute = async (route: [number, number][]) => {
    return await buildRoutBase(awsLocationClient)(route);
  }

  return {
    findBestRoute: findRoute,
    buildRoute: buildRoute
  };
}

export default useRouteCalculation;