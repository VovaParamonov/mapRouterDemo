import GA from "../GeneticAlgorithm/GA";

export const findBestRoute = async (
  coords: [number, number][],
  distanceMatrix: number[][]
) => {
  const processedCoords = coords.map(coordsPair => ({ x: coordsPair[0], y: coordsPair[1] }));

  const bestRoute = GA.startEvolution(50, 1000, distanceMatrix ,processedCoords);

  return bestRoute.tour;
}