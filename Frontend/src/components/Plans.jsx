import React, { Component } from 'react';
import Card from '../reuseablecomponents/Card';

class Plans extends Component {
    state = {  } 
    render() { 
        return (
        <div
          className="flex flex-row flex-wrap justify-center bg-gradient-to-r from-cyan-500 to-blue-500 pt-5" id={this.props.id}
        >
        <div className="lg:basis-6/12 sm:basis-6/12 w-full">
          <Card imagepath={"../assets/Firstplan.jpg"} name={"firstplan"} item1="Generate 10 Images" item2="Download Images" item3="High Quality Format" item4="$20 Only" OnClick={this.props.onClickBasicPlan} />
        </div>
        <div className="lg:basis-5/12 sm:basis-6/12 w-full">
          <Card imagepath={"../assets/Secondplan.jpg"} name={"Secondplan"} item1="Generate 50 Images" item2="Download Images" item3="High Quality Format" item4="$50 Only " OnClick={this.props.onClickProfessionalPlan}  />
        </div>
      </div>
        );
    }
}
 
export default Plans;