export type Coords =  { x: number, y: number }

export default class Location {
  private readonly x: number;
  private readonly y: number;

  constructor(locationData: Coords) {
    this.x = locationData.x;
    this.y = locationData.y;
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }

  public distanceTo(location: Location): number {
    const xDistance = Math.abs(this.getX() - location.getX());
    const yDistance = Math.abs(this.getY() - location.getY());

    return Math.sqrt((xDistance*xDistance) + (yDistance*yDistance));
  }

  compare(location: Location) {
    return (
      this.getX() === location.getX() &&
      this.getY() === location.getY()
    );
  }

  toString() {
    return `{ x: ${this.getX}, y: ${this.getY} }`;
  }
}