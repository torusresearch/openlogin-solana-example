import React from "react";
import { PageHeader, Button } from "antd";
import "./style.scss";

function accountInfo({handleLogout, privKey, walletInfo,account}) {
 return (
    <div>
        <PageHeader
            className="site-page-header"
            title="Openlogin x Solana"
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
              Balance: <i>{(walletInfo && walletInfo.lamports) || 0}</i>
            </div>
            <hr/>
            <span>Private key:</span>
            <div style={{margin:20, maxWidth: 900, wordWrap: "break-word"}}>
               <span style={{margin: 20}}>{(privKey)}</span>
            </div>
          </div>
        </div>
  </div>
 )
}

export default accountInfo;