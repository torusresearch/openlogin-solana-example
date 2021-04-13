import React, { useState } from "react";
import { PageHeader, Button } from "antd";
import "./style.scss";

function AccountInfo({
  handleLogout, privKey, walletInfo,account
}) {
 const [privateKeyHidden, setPkeyVisiblity] = useState(false);
 return (
  <div>
      <PageHeader
          className="site-page-header"
          title="Openlogin x Solana"
          extra={[
              <Button key="1" type="primary" onClick={()=>handleLogout(false)}>
              Logout
              </Button>,
             <Button key="1" type="primary" onClick={()=>handleLogout(true)}>
               Sleep (Fast Login enabled)
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
          {
              !privateKeyHidden ? 
              <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
                <span style={{margin: 20}}>{"********************************"}</span>
                <button onClick={()=>{setPkeyVisiblity(true)}}>Show Private Key</button>
              </div>:
              <div style={{margin:20, maxWidth: 900, wordWrap: "break-word", display:"flex", flexDirection:"column"}}>
               <span style={{margin: 20}}>{(privKey)}</span>
                <button onClick={()=>{setPkeyVisiblity(false)}}>Hide Private Key</button>
              </div>
            }

        </div>
      </div>
</div>
)
}

export default AccountInfo;