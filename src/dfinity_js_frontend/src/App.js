import React from "react";
import "./App.css";
import Chat from "@/components/Chat";

const App = function AppWrapper() {
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
