/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import OpenLogin from "@toruslabs/openlogin";
import { Account, Connection } from "@solana/web3.js";
import nacl from "tweetnacl";
import * as bs58 from "bs58";
import { PageHeader, Button } from "antd";
import { useHistory } from "react-router";
import { verifiers } from "../../utils/config";
import { networks, fromHexString } from "../../utils/solanaHelpers";
import "./style.scss";

const solanaNetwork = networks.mainnet;


function Solana() {
  const [sdk, setSdk] = useState(undefined);
  const [account, setUserAccount] = useState(null);
  const [accountInfo, setUserAccountInfo] = useState(null);
  const [solanaPrivateKey, setPrivateKey] = useState(null)
  const history = useHistory();
  useEffect(() => {
    async function initializeOpenlogin() {
      const sdkInstance = new OpenLogin({ clientId: verifiers.google.clientId, iframeUrl: "http://beta.openlogin.com" });
      await sdkInstance.init();
      if (!sdkInstance.privKey) {
        await sdkInstance.login({
          loginProvider: "google",
          redirectUrl: `${window.origin}/solana`,
        });
      }
      const privateKey = sdkInstance.privKey;
      const solanaPrivateKey = nacl.sign.keyPair.fromSeed(fromHexString(privateKey.padStart(64, 0))).secretKey;
      const account = new Account(solanaPrivateKey);
      setPrivateKey(solanaPrivateKey);
      const accountInfo = await getAccountInfo(solanaNetwork.url, account.publicKey);
      setUserAccount(account);
      setUserAccountInfo(accountInfo);
      setSdk(sdkInstance);
    }
    initializeOpenlogin();
  }, []);


  const getAccountInfo = async(connectionUrl, publicKey) => {
    const connection = new Connection(connectionUrl, "recent");
    const accountInfo = await connection.getAccountInfo(publicKey);
    return accountInfo;
  }


  const handleLogout = async () => {
    await sdk.logout();
    history.push("/");
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Openlogin solana boilerplate"
        extra={[
          <Button key="1" type="primary" onClick={handleLogout}>
            Logout
          </Button>,
        ]}
      />
   
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center", margin: 20 }}>
            <div style={{margin:20}}>
              Wallet address: <i>{account?.publicKey.toBase58()}</i>
            </div>
            <div style={{margin:20}}>
              Balance: <i>{(accountInfo && accountInfo.lamports) || 0}</i>
            </div>
            <hr/>
            <span>Private key:</span>
            <div style={{margin:20, maxWidth: 800, wordWrap: "break-word"}}>
               <span style={{margin: 20}}>{(solanaPrivateKey)}</span>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Solana;
