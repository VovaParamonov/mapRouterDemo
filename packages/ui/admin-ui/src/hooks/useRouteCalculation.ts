import React, { useEffect } from 'react';
import { testCalc } from "../api/routeCalc";

const useRouteCalculation = () => {
  useEffect(() => {
    testCalc();
  }, []);
}

export default useRouteCalculation;