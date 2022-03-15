import React, { FunctionComponent, useContext } from 'react';
import GoogleLogin from 'react-google-login';
import './GoogleLogin.css';
import { LoginContext } from "../../api/LoginContext";

type GoogleLoginProps = {

}

const errorGoogle = (response: any) => {
  console.error('Google login wrong result: ', response);
}

const GoogleLoginComp: FunctionComponent<GoogleLoginProps> = (props) => {
  const { googleLoginStatement, setLoginStatement } = useContext(LoginContext);

  const handleSuccessLogin = (loginData: any) => {
    setLoginStatement(loginData);
  }

  return <div className='google_login' >
    { !googleLoginStatement && (
      <GoogleLogin
        // autoLoad={true}
        clientId="266832583436-f0mfim62si3g2isq9ohhsjm29vgo3anc.apps.googleusercontent.com"
        buttonText="Войти"
        onSuccess={handleSuccessLogin}
        onFailure={errorGoogle}
        cookiePolicy={'single_host_origin'}
      />
    ) }
  </div>;
}

export default GoogleLoginComp;
