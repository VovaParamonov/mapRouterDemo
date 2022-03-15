import React, { FunctionComponent, useEffect, useState } from 'react';
import AWS from 'aws-sdk';
import { Amplify } from "aws-amplify";

AWS.config.region = 'us-east-1';

const credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID!
});

console.log("Credentials: ", credentials);

const locationClientBase = new AWS.Location({
  credentials: credentials,
  region: 'us-east-1',
});

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: "us-east-1",
  },
  geo: {
    AmazonLocationService: {
      maps: {
        items: {
          "TravelingSalesmansTaskDemo": {
            style: "VectorEsriDarkGrayCanvas"
          },
        },
        default: "TravelingSalesmansTaskDemo",
      },
      region: "us-east-1",
    },
  }
});

export type LoginContextType = {
  googleLoginStatement: {
    tokenId: string;
    accessToken: string
  } | null;

  awsLocationClient: AWS.Location | null;

  setLoginStatement: React.Dispatch<React.SetStateAction<LoginContextType['googleLoginStatement']>>;
}

export const LoginContext = React.createContext<LoginContextType>(undefined!);

export const LoginProvider: FunctionComponent = ({ children }) => {
  const [loginStatement, setLoginStatement] = useState<LoginContextType['googleLoginStatement']>(null);
  const [awsLocationClient, setAwsLocationClient] = useState<AWS.Location | null>(locationClientBase);

  useEffect(() => {
    if (loginStatement) {
      console.log('Updated login statement: ', loginStatement);

      const newCredentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID!,
        Logins: {
          'accounts.google.com': loginStatement['tokenId']
        }
      });

      AWS.config.credentials = newCredentials;

      //@ts-ignore
      AWS.config.credentials.get(function(){
        const location = new AWS.Location({
          credentials: newCredentials,
          region: 'us-east-1',
        });

        console.log('New locations: ', newCredentials);

        setAwsLocationClient(location);
      });

      // AWS.config.update(newCredentials);

      console.log('New credentials: ', newCredentials);


    }

  }, [loginStatement]);

  return <LoginContext.Provider value={{
    googleLoginStatement: loginStatement,
    setLoginStatement,
    awsLocationClient
  }}>
    {children}
  </LoginContext.Provider>
}