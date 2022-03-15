import Tour from "./Tour";

export default class Population {
  tours: Tour[];
  sorted = false;

  constructor(populationSize: number, initialise: boolean, GlobalDistanceMatrix: number[][]) {
    this.tours = [];

    if (initialise) {
      for (let i = 0; i < populationSize; i++) {
        const newTour = new Tour(GlobalDistanceMatrix);
        newTour.generateIndividual();
        this.saveTour(i, newTour);
      }
    }
  }

  saveTour(index: number, tour: Tour) {
    this.tours[index] = tour;
  }

  getTour(index: number) {
    return this.tours[index];
  }

  getFittest() {
    let fittest = this.tours[0];

    for (let i = 1; i < this.populationSize(); i++) {
      if (fittest.getFitness() <= this.getTour(i).getFitness()) {
        fittest = this.getTour(i);
      }
    }
    return fittest;
  }

  private sort() {
    if (!this.sorted) {
      this.tours.sort((tour1, tour2) => tour2.getFitness() - tour1.getFitness());

      this.sorted = true;
    }
  }

  getLeaderboards(numberOfLeaderboards: number) {
    this.sort();

    return this.tours.slice(0, numberOfLeaderboards);
  }

  populationSize() {
    return this.tours.length;
  }
}
