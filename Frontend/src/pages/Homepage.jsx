import React, { Component } from "react";
import Header from "../components/Header";
import ModuleDescription from "../components/ModuleDescription";
import Plans from "../components/Plans";
import Footer from "../components/Footer";
import Banner from "../reuseablecomponents/Banner";
import { Route } from "react-router-dom";
class HomePage extends Component {
  state = {};

  buyplan = () => {};

  module1 =
    "With this tool you can convert your original image into a cartoonized image with just a single click.";
  module2 =
    "By using this tool you can transfer the style of one image to another image which generates amazing artwork";
  module3 =
    "Transforming textual content into visually captivating and expressive designs.";
// Inside your HomePage component
showLoginAlert = () => {
  alert("Please login to access these features.");
};

  render() {
    return (
      <>
        <div class="flex flex-col h-screen">
          <Header visible="true" aieffects="#effects" pricingplans="#pricing" />
          <Banner
            bannerpath={"assets/bannerbackground.jpeg"}
            bannername={"Digital Art Banner"}
          />
          <div id="effects"></div>
          <ModuleDescription
            onClick={this.showLoginAlert}
            moduleimagepath={"assets/cartoonizeimage.jpg"}
            modulename={"Cartoonize Image"}
            moduleheading={"Cartoonize Image"}
            moduledescription={this.module1}
            ordermoduleimage={"order-1"}
            ordermoduledescription={"order-2"}
          />
          <ModuleDescription
            onClick={this.showLoginAlert}
            moduleimagepath={"assets/neutralstyletransfer.jpg"}
            modulename={"Neural Style Transfer"}
            moduleheading={"Neutral Style Transfer"}
            moduledescription={this.module2}
            ordermoduleimage={"order-2"}
            ordermoduledescription={"order-1"}
          />
          <ModuleDescription
            onClick={this.showLoginAlert}
            moduleimagepath={"assets/og_thumbnail.jpeg"}
            modulename={"Text to Art"}
            moduleheading={"Text to Art"}
            moduledescription={this.module3}
            ordermoduleimage={"order-1"}
            ordermoduledescription={"order-2"}
          />

          <Route
            render={({ history }) => (
              <Plans
                id="pricing"
                onClickBasicPlan={() => {
                  history.push("/login");
                }}
                onClickProfessionalPlan={() => {
                  history.push("/login");
                }}
              />
            )}
          />
          <div className="mb-0">
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
