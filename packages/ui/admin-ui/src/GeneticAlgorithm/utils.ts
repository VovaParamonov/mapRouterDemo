import Location from "./Location";

export function shuffle(array: any[]) {
  const copiedArray = array.slice();

  let currentIndex = copiedArray.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [copiedArray[currentIndex], copiedArray[randomIndex]] = [
      copiedArray[randomIndex], copiedArray[currentIndex]];
  }

  return copiedArray;
}

export const calculateRoute = (route: Location[]) => {
  return route.reduce((accum, curLocation, index) => {
    if (index == route.length - 1) {
      return accum;
    }

    return accum + curLocation.distanceTo(route[index + 1]);
  }, 0);
}