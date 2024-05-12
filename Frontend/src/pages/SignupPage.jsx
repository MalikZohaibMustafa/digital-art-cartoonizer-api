import React, { Component } from "react";
import "../cssfiles/header.css";
import Button from "./../reuseablecomponents/Button";
import Input from "../reuseablecomponents/Input";
import SocialAuthButton from "../reuseablecomponents/SocialAuthButton";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Signup extends Component {

  state={
    account:{email:'',password:'',confirmpassword:''},
    errors:{},
    currentuser:{name:'',email:''}
  }

  componentDidMount(){
    auth.onAuthStateChanged(user=>{
      const currentuser={...this.state.account};
      currentuser.email=user.email;
      this.setState({currentuser});
      // Redirect to Dashboard Component
      if(currentuser.email!==''){
        this.props.history.push('/dashboard')
      }
    })
  }

  validate=()=>{
    
    const errors={};
    if(this.state.account.email.trim()===''){
      errors.email="Email is required";
    }
    if(this.state.account.password.trim()===''){
      errors.password="Password is required";
    }
    if(this.state.account.confirmpassword.trim()===''){
      errors.confirmpassword="ConfirmPassword is required";
    }
    if(this.state.account.password.trim() !== this.state.account.confirmpassword.trim()){
      errors.match="Passwords donot match";
    }

    return Object.keys(errors).length===0 ? null:errors;
  }


  handleSubmit=async(e)=>{
    e.preventDefault();
    const errors=this.validate();
    this.setState({errors:errors || {} });
    if(errors) return;
    try{
    await createUserWithEmailAndPassword(auth, this.state.account.email, this.state.account.password);
        toast.success("You have been successfully ! Registered", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        //Redirect Logic
        this.props.history.push('/dashboard')
    }catch(error){
      toast.error("Error : Not Registered", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
   

  }

  validateProperty=(input)=>{
    let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(input.name==="email"){
      if(input.value.trim()==="") return "Email cannot be blank";
      if ( ! re.test(input.value) ) return 'Email is Invalid';
    }
    if(input.name==="password"){
      if(input.value.trim()==="") return "Password cannot be blank";
      if(input.value.length < 8) return "Password cannot be less than 8 Characters";
    }
    if(input.name==="confirmpassword"){
      if(input.value.trim()==="") return "Confirm Password cannot be blank";
      if(input.value.length < 8) return "Confirm cannot be less than 8 Characters";
    }


  }

  handleChange=e=>{
    const errors={...this.state.errors}
    const errorMessage=this.validateProperty(e.currentTarget);
    if(errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const account={...this.state.account};
    account[e.currentTarget.name]=e.currentTarget.value;
    this.setState({account,errors});

  }

  authenticateusinggoogle=()=>{
    signInWithPopup(auth, new GoogleAuthProvider())
  .then((result) => {
    console.log("Logged In Successfully");
    this.props.history.push('/dashboard')
  }).catch((error) => {
    alert(error);
   
  });
  }

  authenticateusingfacebook=()=>{
    signInWithPopup(auth, new FacebookAuthProvider())
  .then((result) => {
    console.log("Logged In Successfully");
    this.props.history.push('/dashboard')
  })
  .catch((error) => {
      alert(error);
  });
  }

  render() {

    return (
      <>
      <Header ComponentToRender={""}/>
          <div
            className="flex flex-wrap w-full justify-center p-0 md:p-10"
            style={{ height: "100vh" }}
          >
            <div
              className="w-5/6 lg:w-3/6 text-center text-cyan-600 font-bold"
              
            >
              <h1 className="text-3xl mt-4">SIGN UP</h1>
              <form onSubmit={this.handleSubmit}>
                <Input name="email" type="text" OnChange={this.handleChange} value={this.state.account.email} error={this.state.errors.email}/>
                <Input name="password" type="password" OnChange={this.handleChange} value={this.state.account.password} error={this.state.errors.password}/>
                <Input name="confirmpassword" type="password" OnChange={this.handleChange} value={this.state.account.confirmpassword} error={this.state.errors.confirmpassword || this.state.errors.match}/>
                <p className="text-left  pl-8 md:pl-10 mt-5 font-bold ">
                  By Signing in , you agree to our terms and conditions
                </p>
                <div className="mt-8">
                  <Button size={"w-80 p-2"} name={"Sign Up"} type={"submit"} OnClick={""} />
                </div>
              </form>
              <div className="flex flex-wrap mt-8 justify-around">
                <SocialAuthButton imagepath={"../assets/google-logo.png"} OnClick={this.authenticateusinggoogle} name={"Google"}/>
                <SocialAuthButton imagepath={"../assets/facebook-new.png"}  OnClick={this.authenticateusingfacebook} name={"Facebook"}/>
              </div>
            </div>
          </div>
        <Footer />
        <ToastContainer />
      </>
    );
  }
}

export default Signup;
