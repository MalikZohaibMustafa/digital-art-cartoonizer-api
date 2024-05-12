import React, { Component } from 'react';
import Logo from "../reuseablecomponents/Logo";
import Discord from "../reuseablecomponents/Discord";
import { Route } from 'react-router-dom';
import LinkTo from '../reuseablecomponents/LinkTo';
import Button from '../reuseablecomponents/Button';

class Header extends Component {

  constructor(){
    super();
    this.state = { 
        NavToggle:false,
        width:0,
     } 
     window.addEventListener("resize", this.update);

    }

     componentDidMount=()=>{
       this.update();  
     }

     update=()=>{
      this.setState({
        width: window.innerWidth
      });
     }

     navClicked=()=>{
         
         this.setState({
             NavToggle:!this.state.NavToggle
         })
     }

     
    render() { 
        return (<>
       <div className="flex flex-row flex-wrap bg-blue-50 justify-end w-full h-26">
        <div className="basic-2/6 lg:basis-1/6 py-3 px-5 basis-2/6">
          <Logo />
        </div>
        <div className="hidden lg:block lg:basis-2/6">
          <div className="py-7 flex flex-row gap-10 flex-wrap">
          
        <LinkTo type="false" name="Home" Referto={"/"}  />
        {this.props.visible ?
          <LinkTo name="Al Effects" Referto={this.props.aieffects} type="true"/>
          :''}
        {this.props.visible ?
          <LinkTo name="Pricing" Referto={this.props.pricingplans}  type="true"/>
        :''}
        <LinkTo type="false" name="Contact Us" Referto={"/contact"}  />
          </div>
        </div>
        <div className="hidden lg:block lg:basis-1/6 py-4 pl-20">
          <Discord />
        </div>
        <div className="hidden lg:block lg:basis-2/6 lg:pl-32">
        
        <Route render={({ history}) => (
          <Button type={"text"} name={"Signup"} size={"p-2 ml-2 mr-2 mt-5"} OnClick={() => { history.push('/signup') }} />
          )} />
        <Route render={({ history}) => (
          <Button type={"text"} name={"Login"} size={"p-2 ml-2 mr-2 mt-5"} OnClick={() => { history.push('/login') }} />
          )} />
        </div>
        <div className="block lg:hidden basis-4/6">
                <img
        src="/assets/nav.png"
        alt="Navigation Bar"
        width={40}
        height={30}
        className="cursor-pointer mt-8 mr-3 ml-auto"
        onClick={this.navClicked}
        />
        </div>
      </div>
       
        {this.state.NavToggle===true && this.state.width < 1024 ?
         
      <div className="lg:hidden basis-4/6 flex flex-row justify-end p-4 ">
   <div className="flex flex-row w-full h-full justify-end lg:hidden">
   <div className="flex flex-col w-full items-center">
     <div className="border-cyan-600 p-5 text-cyan-400">
     <LinkTo type="false" name="Home" Referto={"/"}  />
     </div>

     {this.props.visible ?
      <div className="border-cyan-600 p-5 text-cyan-400">
          <LinkTo name="Al Effects" Referto={this.props.aieffects} type="true"/></div>
      :''}
     
     {this.props.visible ?
      <div className="border-cyan-600 p-5 text-cyan-400">
          <LinkTo name="Pricing" Referto={this.props.pricingplans} type="true"/></div>
        :''}
     
     <div className="border-cyan-600 p-5 text-cyan-400">
     <LinkTo type="false" name="Contact Us" Referto={"/contact"}  />
    </div>
     <div className="border-cyan-600 p-5 text-cyan-400">
     <Route render={({ history}) => (
          <Button type={"text"} name={"Signup"} size={"p-3"} OnClick={() => { history.push('/signup') }} />
          )} />
         
        
     </div>
     <div className="border-cyan-600 p-5 text-cyan-400">
     <Route render={({ history}) => (
          <Button type={"text"} name={"Login"} size={"p-3"} OnClick={() => { history.push('/login') }} />)} />    </div>
   </div>
</div>
 </div>
 :''}
 
 
        </>);
    }
}
 
export default Header;