import React, { Component } from "react";
import Button from "../reuseablecomponents/Button";
import Input from "../reuseablecomponents/Input";
import SocialAuthButton from "../reuseablecomponents/SocialAuthButton";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
class LoginPage extends Component {

  state={
    account:{email:'',password:''},
    errors:{},
    currentuser:{name:'',email:''}
  }

  

  componentDidMount(){
    auth.onAuthStateChanged(user=>{
      const currentuser={...this.state.currentuser};
      // currentuser.name=user.displayName;
      currentuser.email=user.email;
      this.setState({currentuser});
      // Redirect to Dashboard Component
      if(currentuser.email!==''){
        this.props.history.push('/dashboard')
      }
    })
  }

  validateProperty=(input)=>{
    let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(input.name==="email"){
      if(input.value.trim()==="") return "Email cannot be blank";
      if ( ! re.test(input.value) ) return 'Email is Invalid';
    }
    if(input.name==="password"){
      if(input.value.trim()==="") return "Password cannot be blank";
    }

  }

  handleSubmit=async(e)=>{
    e.preventDefault();
    try{
    await signInWithEmailAndPassword(auth, this.state.account.email, this.state.account.password);
    console.log("Logged in successful");
        //Redirect Logic
          this.props.history.push('/dashboard')
    }catch(error){
     
      toast.error("Invalid Credentials", {
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
   console.log("Logged in successful");
    this.props.history.push('/dashboard')
  }).catch((error) => {
    alert(error);
   
  });
  }

  authenticateusingfacebook=()=>{
    signInWithPopup(auth, new FacebookAuthProvider())
  .then((result) => {
    console.log("Logged in successful");
      this.props.history.push('/dashboard')
  })
  .catch((error) => {
      alert(error);
  });
  }
  
  render() {
    return (
      <>
        <Header />
          <div
            className="flex flex-wrap w-full justify-center p-0 md:p-10"
            style={{ height: "100vh" }}
          >
            <div
              className="w-5/6 lg:w-3/6 text-center text-cyan-600 font-bold"
            >
              <h1 className="text-3xl mt-4">SIGN IN</h1>
            <form onSubmit={this.handleSubmit}>
              <Input name="email" type="text" OnChange={this.handleChange} value={this.state.account.email} error={this.state.errors.email}/>
              <Input name="password" type="password" OnChange={this.handleChange} value={this.state.account.password} error={this.state.errors.password}/>
              <p className="text-left  pl-6 md:pl-14 mt-3">Forget Password ?</p>
              <div className="mt-8">
                <Button name={"Login"} type={'submit'} size={"w-80 p-2"} OnClick={""} />
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

export default LoginPage;
