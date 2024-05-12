import React, { Component } from 'react';
import Logo from '../reuseablecomponents/Logo';
import {auth} from '../firebase';
import Link from 'react-router-dom/Link';
import { withRouter } from 'react-router-dom';
import Button from '../reuseablecomponents/Button';
import StripeCheckout from "react-stripe-checkout";
import axios from 'axios';
import '../cssfiles/header.css';

class Dashboard extends Component {

    state = {  
          currentuser:{name:'',email:''},
     }
      

     componentDidMount(){
      auth.onAuthStateChanged(user=>{
        const currentuser={...this.state.currentuser};
        currentuser.name=user.displayName;
        currentuser.email=user.email;
        this.setState({currentuser});
      })
    }

    loggingout=()=>{
      auth.signOut();
      localStorage.setItem("status",false);
      this.props.history.push('/');
    }

    makePaymentBasic=(token)=>{

      axios.post('https://digital-art-backend-pcu8.onrender.com/payment',{
        token
      }).then(response=>{
        console.log(response);
      }).catch(err=>{
        console.log(err);
      })
    }

    makePaymentPro=async(token)=>{

      try{
      let response=await axios.post('https://digital-art-backend-pcu8.onrender.com/paymentpro',{
        token
      });
      console.log(response);
    }catch(err){
        console.log(err);
    }
    }

    

    render() { 
      
        return (
        <>
    <div className="flex flex-row flex-wrap bg-blue-50">
        <div className="basis-4/6 lg:basis-5/6 py-3 px-5">
          <Link to="/">
            <Logo />
        </Link>
        </div>
            
        <div className="lg:basis-1/6 py-3 basis-2/6 pt-8 font-bold">
       
        <div class="dropdown">
            <img src="assets/avatar.png" alt="profile" width={50} height={50} style={{"cursor":"pointer"}}/>
          <div class="dropdown-content">
          <h4 className="text-cyan-600  p-2 hover:text-cyan-400 text-sm hover:cursor-pointer">{this.state.currentuser.name===null?this.state.currentuser.email:this.state.currentuser.name}</h4>
          <h4 className="text-cyan-600  p-2 hover:text-cyan-400 text-sm hover:cursor-pointer" onClick={this.loggingout}>Logout</h4>
          </div>
        </div>
         
        </div>
    </div>
    
        <div className="flex flex-row flex-wrap justify-center pt-6 pb-8 gap-10 bg-gradient-to-r from-violet-500 to-fuchsia-500">
          <div className="flex-item-1 md:basis-3/12 basis-9/12">
              <Link to="/cartoonize"><img src="assets/cartoonizeimage.jpg" alt="First Module" style={{height:250}} className="border-4
    border-white-500 rounded-2xl hover:scale-110 hover:cursor-pointer"/></Link>
              <p className='text-center font-bold pt-4 pb-4 text-white'>Generate Cartoonize Image</p>
          </div>
          <div className="flex-item-2  md:basis-3/12 basis-9/12">
              <Link to="/neutraltransfer"><img src="assets/neutralstyletransfer.jpg" alt="Second Module" style={{height:250}} className="border-4
    border-white-500 rounded-2xl hover:scale-110 hover:cursor-pointer"/></Link>
              <p className='text-center font-bold pt-4 pb-4 text-white'>Generate Neutral Style Transfer Image</p>
          </div>

          <div className="flex-item-2  md:basis-3/12 basis-9/12">
              <Link to="/text-to-image"><img src="assets/og_thumbnail.jpeg" alt="Second Module" style={{height:250, width: 1000}} className="border-4
    border-white-500 rounded-2xl hover:scale-110 hover:cursor-pointer"/></Link>
              <p className='text-center font-bold pt-4 pb-4 text-white'>Generate Text to Image</p>
          </div>
        </div>

        <div className='w-full pt-4 pb-4 underline text-center font-bold text-3xl text-white bg-gradient-to-r from-violet-500 to-fuchsia-500'><h1>Plans</h1></div>
        <div
          className="flex flex-row flex-wrap justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500" id={this.props.id}
        >
        <div className="lg:basis-6/12 sm:basis-6/12 w-full">
          <div
          className="flex flex-col gap-5 mt-3"
        >
          <div className="rounded-md h-600">
            <img
              src={"../assets/Firstplan.jpg"}
              alt={"basicplan"}
              className="border-4
    border-white-500 rounded-2xl img-size ml-auto mr-auto hover:cursor-pointer hover:scale-110"
            />
          </div>
          <div className="ml-auto mr-auto">
            <ol>
              <li className='text-white'>
                {"--> "}{"Generate 10 Images"}
              </li>
              <li className='text-white'>
                {"--> "}{"Download All Images"}
              </li>
              <li className='text-white'>
                {"--> "}{"High Quality Format"}
              </li>
              <li className='text-white'>
                {"--> "}{"$20 Only"}
              </li>
            </ol>
          </div>
          <div className='ml-auto mr-auto mb-10'>
        <StripeCheckout
          stripeKey='pk_test_51LSq56SBthRp6nG0XApAV1pXBIHvvfa0vHBQCLcD7627vfguLEoi9JHczRcpUtCrhO4AOS3SypYBnubBB9DXwNNU00D5YrMU86'
          token={this.makePaymentBasic}
          name="Basic Plan"
          email={this.state.currentuser.email}
          amount={2000} 
          currency="USD"
        >
            <Button size={"w-80 p-2"} name={"Buy Now"} />
        </StripeCheckout> 
        </div>
        </div>
        </div>
        <div className="lg:basis-5/12 sm:basis-6/12 w-full">
        <div className="lg:basis-6/12 sm:basis-6/12 w-full">
          <div
          className="flex flex-col gap-5 mt-3"
        >
          <div className="rounded-md h-600">
            <img
              src={"../assets/Secondplan.jpg"}
              alt={"basicplan"}
              className="border-4 border-white-500 rounded-2xl img-size ml-auto mr-auto hover:cursor-pointer hover:scale-110"
            />
          </div>
          <div className="ml-auto mr-auto">
            <ol>
              <li className='text-white'>
                {"--> "}{"Generate 50 Images"}
              </li>
              <li className='text-white'>
                {"--> "}{"Download All Images"}
              </li>
              <li className='text-white'>
                {"--> "}{"High Quality Format"}
              </li>
              <li className='text-white'>
                {"--> "}{"$50 Only"}
              </li>
            </ol>
          </div>
          <div className='ml-auto mr-auto mb-10'>
          <StripeCheckout
          stripeKey='pk_test_51LSq56SBthRp6nG0XApAV1pXBIHvvfa0vHBQCLcD7627vfguLEoi9JHczRcpUtCrhO4AOS3SypYBnubBB9DXwNNU00D5YrMU86'
          token={this.makePaymentPro}
          name="Profession Plan"
          email={this.state.currentuser.email}
          amount={5000} 
          currency="USD"
        >
            <Button size={"w-80 p-2"} name={"Buy Now"} />
          </StripeCheckout>
          </div>
        </div>
        </div>
      </div>
      </div>
        </>);
    }
}
 
export default withRouter(Dashboard);