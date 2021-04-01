/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React from "react";
import OpenLogin from "@toruslabs/openlogin";
import { verifiers } from "../../utils/config";
import "./style.scss";

function Login() {
  async function handleLogin() {
  
    const sdkInstance = new OpenLogin({ 
      clientId: verifiers.google.clientId,  // your project id
      network: "testnet",
      originData: {
        [window.location.origin]: verifiers.google.sig
      }
     });
    await sdkInstance.login({
      loginProvider: "google",
      redirectUrl: `${window.origin}/solana`,
    });
  }
  return (
    <div className="loginContainer">
      <div className="loginContainer">
        <h1 style={{ textAlign: "center" }}>Openlogin x Solana</h1>
        <div onClick={handleLogin} className="btn">
          Login
        </div>
      </div>
    </div>
  );
}

export default Login;
