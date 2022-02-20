import AWS  from 'aws-sdk';

AWS.config.region = 'us-east-1';

const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID!
});

console.log("Credentials: ", credentials);

const locationClient = new AWS.Location({
  credentials: credentials,
  region: 'us-east-1',
});

const paramsExample = {
  CalculatorName: "TravelingSalesmansTaskDemoRouteCalculator",
  DeparturePosition: [-123.4567, 45.6789],
  DestinationPosition: [-123.123, 45.234]
};

export const testCalc = () => {
  locationClient.calculateRoute(paramsExample, function(err, data) {
    if (err) console.log('Error while calculation', err, err.stack); // an error occurred
    else     console.log('Successful calculation: ', data);           // successful response
  });
}