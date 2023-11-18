import React from "react";
// import "./App.css";
import "./index.css";
import Chat from "./components/Chat";
import Wallet from "./components/Wallet";
import coverImg from "./assets/img/sandwich.jpg";
import { login, logout as destroy } from "./utils/auth";
import { balance as principalBalance } from "./utils/ledger";
import Cover from "./components/utils/Cover";
import { Notification } from "./components/utils/Notifications";

const App = function AppWrapper() {
  const isAuthenticated = window.auth.isAuthenticated;
  const principal = window.auth.principalText;

  const [balance, setBalance] = React.useState("0");

  const getBalance = React.useCallback(async () => {
    if (isAuthenticated) {
      setBalance(await principalBalance());
    }
  });

  React.useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <main>
        <div className="watermark">DACADE</div>
        <Chat />
      </main>
    </>
  );
};

export default App;
