import AWS  from 'aws-sdk';

const paramsExample = {
  CalculatorName: "TravelingSalesmansTaskDemoRouteCalculator",
  DeparturePosition: [73.36395111083993, 54.991179338182064],
  DestinationPosition: [73.38043060302715, 54.98172389802377],
  WaypointPositions: [
    [73.3864387512213, 54.98428496633704]
  ],
  IncludeLegGeometry: true
};

export const buildRoute = (locationClient: AWS.Location | null) => async (coords: [number, number][]) => {
  if (!locationClient) {
    console.error('There is no locationCLient');
    return;
  }

  const params = {
    CalculatorName: "TravelingSalesmansTaskDemoRouteCalculator",
    DeparturePosition: null as [number, number] | null, // fill it with coords
    DestinationPosition: null as [number, number] | null, // fill it with coords
    WaypointPositions: [] as [number, number][], // fill it with points
    IncludeLegGeometry: true
  }

  params.DeparturePosition = coords[0];
  params.DestinationPosition = coords[coords.length - 1];

  params.WaypointPositions = coords.slice(1, coords.length - 1);

  console.log('Used location: ', locationClient);

  try {
    return await locationClient.calculateRoute(params as any).promise();
  } catch (e) {
    console.error('Error when request route building');
  }
}

export const getDistanceMatrix = (locationClient: AWS.Location | null) => async (coords: [number, number][]) => {
  if (!locationClient) {
    console.error('There is no locationCLient');
    return;
  }

  const params = {
    CalculatorName: "TravelingSalesmansTaskDemoRouteCalculator",
    DeparturePositions: ([] as [number, number][]),
    DestinationPositions: ([] as [number, number][]),
    TravelMode: 'Car',
  };

  coords.forEach(coordsPair => {
    params.DestinationPositions.push(coordsPair);
    params.DeparturePositions.push(coordsPair)
  });

  try {
    const matrix = await locationClient.calculateRouteMatrix(params).promise();

    console.log('Got calculatedMatrix: ', matrix);

    return matrix;
  } catch (e) {
    console.error('Something went wrong with matrix calc: ', e);
  }
}