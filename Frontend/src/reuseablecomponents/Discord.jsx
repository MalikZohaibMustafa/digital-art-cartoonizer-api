import React from "react";
import "../cssfiles/header.css";
import { Link } from "react-router-dom";
function Discord() {
  return (
    <>
    <Link to={{ pathname: "https://discord.com/channels/722374645528920105/722374648863522919"}} target="_blank"> <img
        src="/assets/discord.png"
        id="discord"
        alt="Discord Logo"
        className="hover:cursor-pointer"
        title="Join Discord"
      /></Link>
    </>
  );
}

export default Discord;
