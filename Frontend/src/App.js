import React from "react";
import Homepage from "../src/pages/Homepage";
import Signup from "../src/pages/SignupPage";
import LoginPage from "./pages/Loginpage";
import Contact from "./pages/Contactus";
import Cartoonize from "./pages/Cartoonize";
import NeutralTransfer from "./pages/Neutraltransfer";
import PageNotFound from "./pages/Pagenotfound";
import Dashboard from "./pages/Dashboard";
import BuyArt from "./pages/Buyart";
import Lightning from "./pages/TextToImg";
import Protectedroute from "./components/Protectedroute";
import { Redirect, Route, Switch } from "react-router-dom";
import { auth } from "./firebase";

function App() {
  var user = auth.currentUser;
  console.log(user);
  let status = false;
  if (user != null) {
    status = true;
  }
  return (
    <>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={LoginPage} />
        <Route path="/contact" component={Contact} />
        <Protectedroute path="/text-to-image" component={Lightning} isAuth={status}/>
        <Protectedroute
          path="/dashboard"
          Component={Dashboard}
          isAuth={status}
        />
        <Protectedroute
          path="/cartoonize"
          Component={Cartoonize}
          isAuth={status}
        />
        <Protectedroute
          path="/neutraltransfer"
          Component={NeutralTransfer}
          isAuth={status}
        />
        <Protectedroute path="/buyart" Component={BuyArt} isAuth={status} />
        <Route path="/pagenotfound" component={PageNotFound} />
        <Route path="/" exact component={Homepage} />
        <Redirect to="/pagenotfound" />
      </Switch>
    </>
  );
}

export default App;
