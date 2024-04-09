import React, { useState, useEffect } from "react";
import { Button, Row, Col, Drawer, Typography } from "antd";
import Web3 from "web3";
const { Paragraph } = Typography;
const WalletConnect = () => {
  const [isConnected, setConnected] = useState(false);
  const [account, setAccount] = useState("");

  useEffect(() => {
    connectToWeb3();

    // Función de limpieza
    return () => {
      disconnectFromWeb3();
    };
  }, []);

  const connectToWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setConnected(true);
        // Cambiar a la red de Mumbai
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }], // ID de la red de Mumbai en Polygon
        });
      } catch (error) {
        console.error("Error al conectar a Web3:", error);
      }
    } else {
      console.error("Web3 no está disponible en este navegador.");
    }
  };

  const disconnectFromWeb3 = () => {
    setConnected(false);
    setAccount("");
  };

  return (
    <div>
      {!isConnected ? (
        <button className="mx-3 myButton  myBule text-white px-5 text-sm" onClick={connectToWeb3}>
          Conect Metamask
        </button>
      ) : (
        <div>
          <Paragraph copyable className="myColor1 font-bold ">
            {account}
          </Paragraph>
          <button className="mx-3 myButton  myBule text-white px-5 text-sm" onClick={disconnectFromWeb3}>
            Disconect Metamask
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
