import React from "react";
import "./Home.css";

import { useAuth } from "@contexts/AuthContext";

function Home() {
  const { login, logout } = useAuth();

  return (
    <div className="Home">
      <button onClick={() => login("purplezebra536", "password")}>login</button>
      <button onClick={() => login("lazypanda267", "password")}>login 2</button>

      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

export default Home;
