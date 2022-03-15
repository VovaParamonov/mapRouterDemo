import Population from "./Population";
import Tour from "./Tour";
import Location, { Coords } from "./Location";
import TourManager from "./TourManager";

export default class GA {
  /* GA parameters */
  private static mutationRate = 0.1;
  private static tournamentSize = 10;
  private static elitism = true;
  static GlobalDistanceMatrix: number[][];

  static bestTour: Tour;
  static bestDistance: number = Number.MAX_VALUE;

  static evolvePopulation(pop: Population) {
    const newPopulation = new Population(pop.populationSize(), false, this.GlobalDistanceMatrix);

    // Keep our best individual if elitism is enabled
    let elitismOffset = 0;
    if (GA.elitism) {
      newPopulation.saveTour(0, pop.getFittest());
      elitismOffset = 1;
    }

    for (let i = elitismOffset; i < newPopulation.populationSize(); i++) {
      // Select parents
      const parent1 = this.tournamentSelection(pop);
      const parent2 = this.tournamentSelection(pop);

      const child = this.crossover(parent1, parent2);

      newPopulation.saveTour(i, child);
    }

    newPopulation.tours.map(this.mutate); // Different with example

    return newPopulation;
  }

  static crossover(parent1: Tour, parent2: Tour) {
    const childTour: Tour = new Tour(this.GlobalDistanceMatrix);

    let startPos = Math.floor(Math.random() * parent1.tourSize());
    let endPos = Math.floor(Math.random() * parent1.tourSize());

    for (let i = 0; i < childTour.tourSize(); i++) {
      if (startPos < endPos && i > startPos && i < endPos) {
        childTour.setLocation(i, parent1.getLocation(i)!);
      }
      else if (startPos > endPos) {
        if (!(i < startPos && i > endPos)) {
          childTour.setLocation(i, parent1.getLocation(i)!);
        }
      }
    }

    for (let i = 0; i < parent2.tourSize(); i++) {
      // If child doesn't have the city add it
      if (!childTour.containsLocation(parent2.getLocation(i)!)) {
        // Loop to find a spare position in the child's tour
        for (let j = 0; j < childTour.tourSize(); j++) {
          // Spare position found, add city
          if (childTour.getLocation(j) == null) {
            childTour.setLocation(j, parent2.getLocation(i)!);
            break;
          }
        }
      }
    }

    return childTour;
  }

  static mutate(tour: Tour) {
    // Loop through tour cities
    for(let tourPos1=0; tourPos1 < tour.tourSize(); tourPos1++){
      // Apply mutation rate
      if(Math.random() < GA.mutationRate){
        // Get a second random position in the tour
        let tourPos2 = Math.floor(tour.tourSize() * Math.random());

        // Get the cities at target position in tour
        const location1: Location = tour.getLocation(tourPos1)!;
        const location2: Location = tour.getLocation(tourPos2)!;

        // Swap them around
        tour.setLocation(tourPos2, location1);
        tour.setLocation(tourPos1, location2);
      }
    }
  }

  static tournamentSelection(pop: Population) {
    const tournament = new Population(GA.tournamentSize, false, GA.GlobalDistanceMatrix);

    for (let i = 0; i < GA.tournamentSize; i++) {
      const randomId =  Math.floor(Math.random() * pop.populationSize());

      tournament.saveTour(i, pop.getTour(randomId));
    }

    return tournament.getFittest();
  }


  static startEvolution(
    populationSize: number = 50,
    generations: number = 100,
    distanceMatrix: typeof GA.GlobalDistanceMatrix,
    coords?: Coords[], cb?: () => void
  ) {
    GA.GlobalDistanceMatrix = distanceMatrix;

    if (coords) {
      TourManager.generateLocationsFromCoords(coords);
    }

    let population = new Population(populationSize, true, GA.GlobalDistanceMatrix);

    console.log('Initial distance: ' + population.getFittest().getDistance());

    for (let i = 0; i < generations; i++) {
      population = GA.evolvePopulation(population);

      const tour = population.getFittest();
      let distance;

      if ((distance = tour.getDistance()) < GA.bestDistance) {
        GA.bestTour = tour;
        GA.bestDistance = distance;
      }
    }

    if (cb) {
      cb();
    }

    console.log('Best found tour distance for all: ', GA.bestDistance );

    // TODO: Check if this is really the best route ever found during the execution of the algorithm
    // Returning the best route
    return population.getFittest();
  }
}