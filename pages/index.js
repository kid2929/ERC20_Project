import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import gill_ABI from "../artifacts/contracts/Gill.sol/Gill.json";

export default function HomePage() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with your contract address

  useEffect(() => {
    if (provider) {
      try {
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, gill_ABI.abi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error creating contract instance:", error);
      }
    }
  }, [provider]);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(connection);
      setProvider(ethersProvider);

      const signer = ethersProvider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const balance = await ethersProvider.getBalance(address);
      setBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const mintTokens = async () => {
    try {
      if (!contract) {
        throw new Error("Contract instance not initialized.");
      }

      console.log("Minting tokens...");
      const tx = await contract.mint(recipient, ethers.utils.parseUnits(amount, 18));
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Minting successful!");
      alert("Tokens minted successfully!");
      getBalance(); // Refresh balance after minting
    } catch (error) {
      console.error("Error minting tokens:", error.message);
      alert("Error minting tokens. Please check the console for details.");
    }
  };

  const burnTokens = async () => {
    try {
      if (!contract) {
        throw new Error("Contract instance not initialized.");
      }

      console.log("Burning tokens...");
      const tx = await contract.burn(ethers.utils.parseUnits(amount, 18));
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Burning successful!");
      alert("Tokens burned successfully!");
      getBalance(); // Refresh balance after burning
    } catch (error) {
      console.error("Error burning tokens:", error.message);
      alert("Error burning tokens. Please check the console for details.");
    }
  };

  const transferTokens = async () => {
    try {
      if (!contract) {
        throw new Error("Contract instance not initialized.");
      }

      console.log("Transferring tokens...");
      const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, 18));
      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Transfer successful!");
      alert("Tokens transferred successfully!");
      getBalance(); // Refresh balance after transfer
    } catch (error) {
      console.error("Error transferring tokens:", error.message);
      alert("Error transferring tokens. Please check the console for details.");
    }
  };

  const getBalance = async () => {
    try {
      if (account) {
        const balanceWei = await provider.getBalance(account);
        setBalance(ethers.utils.formatEther(balanceWei));
      }
    } catch (error) {
      console.error("Error getting balance:", error.message);
    }
  };

  useEffect(() => {
    getBalance();
  }, [account, contract]);

  return (
    <main className="container">
      <header>
        <h1>My ERC20 Token Interface</h1>
      </header>
      <div className="account-info">
        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <p>Account: {account}</p>
            <p>Balance: {balance} ETH</p>
            <div>
              <input
                type="text"
                placeholder="Recipient address (e.g., 0xYourAddress)"
                onChange={(e) => setRecipient(e.target.value)}
              />
              <input
                type="text"
                placeholder="Amount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button onClick={mintTokens}>Mint Tokens</button>
            <button onClick={burnTokens}>Burn Tokens</button>
            <button onClick={transferTokens}>Transfer Tokens</button>
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          background: linear-gradient(45deg, #000000, #555555, #ff0000);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        header {
          background-color: #4caf50;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        h1 {
          color: white;
        }
        .account-info {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        p {
          margin: 10px 0;
        }
        .action-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 20px;
          margin: 5px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .action-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </main>
  );
}
