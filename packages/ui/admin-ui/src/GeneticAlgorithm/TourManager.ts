import Location, { Coords } from "./Location";

export default class TourManager {
  private static locations: Location[];

  public static addLocation(location: Location) {
    TourManager.locations.push(location);
  }

  public static getLocation(index: number) {
    return TourManager.locations[index];
  }

  public static numberOfLocations() {
    return TourManager.locations.length;
  }

  public static generateLocationsFromCoords(coords: Coords[]) {
    TourManager.locations = [];
    coords.forEach(coordsPare => TourManager.addLocation(new Location(coordsPare)));
  }
}