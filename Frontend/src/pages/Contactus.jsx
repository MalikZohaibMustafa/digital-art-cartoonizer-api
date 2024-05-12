import React, { Component } from 'react';
import Button from '../reuseablecomponents/Button';
import Input from '../reuseablecomponents/Input';
import Heading from '../reuseablecomponents/Heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {db} from '../firebase';
import {collection,addDoc} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Contact extends Component {

  state = { 
    feedbackrecord:{topic:'',query:'',feedback:''},
    errors:{}
   } 


   handleChange=e=>{
    const errors={...this.state.errors}
    const errorMessage=this.validateProperty(e.currentTarget);
    if(errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const feedbackrecord={...this.state.feedbackrecord};
    feedbackrecord[e.currentTarget.name]=e.currentTarget.value;
    this.setState({feedbackrecord,errors});

  }

  validateProperty=(input)=>{
    if(input.name==="topic"){
      if(input.value.trim()==="") return "Topic cannot be blank";
    }
    if(input.name==="query"){
      if(input.value.trim()==="") return "Query cannot be blank";
    }
    if(input.name==="feedback"){
      if(input.value.trim()==="") return "Feedback cannot be blank";
    }

  }

  handleSubmit=async(e)=>{
    e.preventDefault();
    //Send Data to Firebase
    const userCollection=collection(db,"feedback");
        try{
        await addDoc(userCollection,{feedback:this.state.feedbackrecord.feedback,query:this.state.feedbackrecord.query,topic:this.state.feedbackrecord.topic})
        toast.success("Feedback/Query is Recorded", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        }catch(e){
          toast.error("Error Occurred", {
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

  render() { 
    return (
      <>
      <Header />
          <div className='bg-gradient-to-r from-cyan-500 to-blue-500'>
            <div
              className="w-full lg:w-3/6 text-center  font-bold ml-auto mr-auto"
            >
              <div className="flex justify-center ">
                <img
                  src="../assets/contact.gif"
                  alt="Contact Us Gif"
                  width={200}
                  height={150}
                />
              </div>
              <Heading headingsize={"large"} headingcontent={"Contact Us"} />
              <form onSubmit={this.handleSubmit}>
              <Input name="topic" type="text" OnChange={this.handleChange} value={this.state.feedbackrecord.topic} error={this.state.errors.topic}/>
              <Input name="query" type="text" OnChange={this.handleChange} value={this.state.feedbackrecord.query} error={this.state.errors.query}/>
              <Input name="feedback" type="text" OnChange={this.handleChange} value={this.state.feedbackrecord.feedback} error={this.state.errors.feedback}/>
              <div className="mt-8 pb-4">
                <Button name={"Submit"} type={'submit'}  size={"w-80 h-10"} OnClick={""}/>
              </div>
              </form>
            </div>
            </div>
            <Footer />
            <ToastContainer />
            </>
   );
  }
}
  
 
export default Contact;
