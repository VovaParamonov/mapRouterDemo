import { shuffle } from "./utils";
import TourManager from "./TourManager";
import Location from "./Location";

export default class Tour {
  tour: (Location | null)[];
  private fitness = 0;
  private distance = 0;
  private GlobalDistanceMatrix: number[][];

  constructor(GlobalDistanceMatrix: Tour['GlobalDistanceMatrix'] ,locations?: Location[]) {
    this.GlobalDistanceMatrix = GlobalDistanceMatrix;

    if (locations) {
      this.tour = locations;
    } else {
      this.tour = [];
      for (let i = 0; i < TourManager.numberOfLocations(); i++) {
        this.tour.push(null)
      }
    }
  }

  generateIndividual() {
    for (let locationIndex = 0; locationIndex < TourManager.numberOfLocations(); locationIndex++) {
      this.setLocation(
        locationIndex,
        TourManager.getLocation(locationIndex)
      ); // TODO: probably it will be better to use array copying
    }

    this.tour = shuffle(this.tour);
  }

  setLocation(tourPosition: number, location: Location) {
    this.tour[tourPosition] = location;
    // If the tours been altered we need to reset the fitness and distance
    this.fitness = 0;
    this.distance = 0;
  }

  getLocation(tourPosition: number) {
    return this.tour[tourPosition];
  }

  getFitness() {
    if (this.fitness === 0) {
      this.fitness = 1 / this.getDistance();
    }
    return this.fitness;
  }

  // Get total distance of the tour
  // TODO: Rewrite with reduce
  getDistance(){
    if (this.distance == 0) {
      let tourDistance = 0;

      for (let locationIndex=0; locationIndex < this.tourSize(); locationIndex++) {
        let fromLocationIndex: number = locationIndex;
        let destinationLocationIndex: number;

        // Check we're not on our tour's last location, if we are set our
        // tour's final destination location to our starting location
        if(locationIndex+1 < this.tourSize()){
          destinationLocationIndex = locationIndex+1;
        }
        else{
          destinationLocationIndex = 0;
        }

        try {
          tourDistance += this.GlobalDistanceMatrix[fromLocationIndex][destinationLocationIndex];
        } catch (e) {
          console.error(
            'Global matrix inndex error. \n',
            'indexe: ', fromLocationIndex,
            '\n Matrix: ', this.GlobalDistanceMatrix
          );
          console.error('OtherDetails: ', e);
        }
      }
      this.distance = tourDistance;
    }

    return this.distance;
  }

  tourSize() {
    return this.tour.length;
  }

  containsLocation(location: Location) {
    return !!this.tour.find(insideLocation => insideLocation?.compare(location));
  }

  toString() {
    let geneString = '|';

    this.tour.forEach(location => {
      geneString += location + '\n';
    });

    return geneString;
  }
}