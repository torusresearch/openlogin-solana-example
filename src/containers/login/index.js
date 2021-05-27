import React, { useEffect, useState } from "react";
import OpenLogin from "openlogin";
import AccountInfo  from "../../components/AccountInfo";
import { Account, Connection, clusterApiUrl } from "@solana/web3.js";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import * as bs58 from "bs58";

import "./style.scss";

const networks = {
  mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
  devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
  testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
};

const solanaNetwork = networks.testnet;
const connection = new Connection(solanaNetwork.url);

function Login() {
  const [loading, setLoading] = useState(false);
  const [openlogin, setSdk] = useState(undefined);
  const [account, setUserAccount] = useState(null);
  const [walletInfo, setUserAccountInfo] = useState(null);
  const [solanaPrivateKey, setPrivateKey] = useState(null)
  const [torusNetwork, setTorusNetwork] = useState('mainnet')

  useEffect(() => {
    setLoading(true);
    async function initializeOpenlogin() {
      console.log("client id", process.env.REACT_APP_CLIENT_ID);
      const sdkInstance = new OpenLogin({
        clientId: process.env.REACT_APP_CLIENT_ID, // your project id
        network: torusNetwork,
      });
      await sdkInstance.init();
      console.log("priv key", sdkInstance.privKey)
      if (sdkInstance.privKey) {
        const privateKey = sdkInstance.privKey;
        const secretKey = getSolanaPrivateKey(privateKey);
        await getAccountInfo(secretKey);
      }
      setSdk(sdkInstance);
      setLoading(false);
    }
    initializeOpenlogin();
  }, []);


  const getSolanaPrivateKey = (openloginKey)=>{
    const  { sk } = getED25519Key(openloginKey);
    return sk;
  }

  const getAccountInfo = async(secretKey) => {
    const account = new Account(secretKey);
    const accountInfo = await connection.getAccountInfo(account.publicKey);
    setPrivateKey(bs58.encode(account.secretKey));
    setUserAccount(account);
    setUserAccountInfo(accountInfo);
    return accountInfo;
  }

  async function handleLogin() {
    setLoading(true)
    try {
      const privKey = await openlogin.login({
        redirectUrl: `${window.origin}`,
        relogin: true
      });
      if(privKey && typeof privKey === "string") {
        const solanaPrivateKey = getSolanaPrivateKey(privKey);
        await getAccountInfo(solanaNetwork.url,solanaPrivateKey);
      } 
    
      setLoading(false)
    } catch (error) {
      console.log("error", error);
      setLoading(false)
    }
  }

  const handleLogout = async (fastLogin=false) => {
    setLoading(true)
    await openlogin.logout({
       fastLogin
    });
    setLoading(false)
  };

  const onChangeTorusNetwork = (e)=>{
    console.log("vla", e.target.value)
    setTorusNetwork(e.target.value)
  }
  return (
    <>
    {
    loading ?
      <div>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
              <h1>....loading</h1>
          </div>
      </div> :
      <div>
        {
          (openlogin && openlogin.privKey) ?
            <AccountInfo
              handleLogout={handleLogout}
              loading={loading}
              privKey={solanaPrivateKey}
              walletInfo={walletInfo}
              account={account}
            /> :
            <div className="loginContainer">
                <h1 style={{ textAlign: "center" }}>Openlogin x Solana</h1>
                <div onClick={handleLogin} className="btn">
                  Login
                </div>
                <select onChange={onChangeTorusNetwork} style={{ margin: 20 }}>
                  <option id="mainnet">mainnet</option>
                  <option id="testnet">testnet</option>
                </select>
            </div>
        }

      </div>
    }
    </>
  );
}

export default Login;
