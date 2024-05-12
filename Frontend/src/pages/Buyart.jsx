import React, { Component } from 'react'
import Input from '../reuseablecomponents/Input'
import Logo from '../reuseablecomponents/Logo'
import Footer from '../components/Footer'
import Button from '../reuseablecomponents/Button'
import {auth,db} from '../firebase';
import {collection,addDoc} from 'firebase/firestore';
import { withRouter } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

class Buyart extends Component {
  state = {  
    currentuser:{name:'',email:''},
    errors:{},
    order:{name:'',email:'',contactnumber:'',frame:'',address:'',image:''}
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
this.props.history.push('/');
}

validateProperty=(input)=>{
  if(input.name==="Name"){
    if(input.value.trim()==="") return "Name cannot be blank";
  }
  if(input.name==="Contact Number"){
    if(input.value.trim()==="") return "Contact Number cannot be blank";
  }
  if(input.name==="Frame"){
    if(input.value.trim()==="") return "Frame cannot be blank";
  }
  if(input.name==="Address"){
    if(input.value.trim()==="") return "Address cannot be blank";
  }

}

handleChange=e=>{
  const errors={...this.state.errors}
  const errorMessage=this.validateProperty(e.currentTarget);
  if(errorMessage) errors[e.currentTarget.name] = errorMessage;
  else delete errors[e.currentTarget.name];

  const order={...this.state.order};
  order[e.currentTarget.name]=e.currentTarget.value;
  this.setState({order,errors});
}

handleChangeinoption=e=>{
  const errors={...this.state.errors}
  const errorMessage=this.validateProperty(e.currentTarget);
  if(errorMessage) errors[e.currentTarget.name] = errorMessage;
  else delete errors[e.currentTarget.name];

  const order={...this.state.order};
  order[e.currentTarget.name]=e.currentTarget.value;
  this.setState({order,errors});

}


handleSubmit=async(e)=>{
  e.preventDefault();
  //Send Data to Firebase
  const userCollection=collection(db,"order");
      try{
      await addDoc(userCollection,{address:this.state.order.address,contactnumber:this.state.order.contactnumber,email:this.state.currentuser.email,frame:this.state.order.frame,image:localStorage.getItem("generatedimg"),name:this.state.order.name})
      toast.success("Thanks For Ordering", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
        
      try{
        const email=this.state.currentuser.email;
        console.log(email);
        const data = {
          service_id: 'service_ljar5b9',
          template_id: 'template_bnut09b',
          user_id: '-LMxjjdJ_ADZD-psI',
          template_params: {
            message: "Weclome to Digital Art Club",
            email: email,
        }
      };
      await axios.post('https://api.emailjs.com/api/v1.0/email/send', data) ;
      toast.success("Order Confirmation Email Sent", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }catch(err)
      {
        toast.error("Email Failed to Sent", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
      // this.props.history.push('/dashboard');

      }catch(e){
        toast.error("Error Occured ", {
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
          <div className="flex flex-row flex-wrap bg-blue-50">
        <div className="basis-4/6 lg:basis-5/6 py-3 px-5">
          <Logo />
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

            <div className="flex flex-wrap w-full justify-center p-0 md:p-10">
            <div
              className="w-5/6 lg:w-3/6 text-center text-cyan-600 font-bold"
            >
              <h4 className="text-3xl mt-4">Enter The Order Details</h4>
            <form onSubmit={this.handleSubmit}>
              <Input name="name" type="text" OnChange={this.handleChange} value={this.state.order.name} error={this.state.errors.name}/>
              <Input name="contactnumber" type="tel" OnChange={this.handleChange} value={this.state.order.contactnumber} error={this.state.errors.contactnumber}/>










        <div className="flex mt-8">
          <div className="w-2/6">
              <label
                className="text-cyan-900"
                name="frames"
              >
                Choose Frame
              </label>        
          </div>
        <div className="w-4/6">
            <select name="frame" className='border-8 p-1' onChange={this.handleChangeinoption} value={this.state.order.frame} error={this.state.errors.frame}>
                <option value="box">Box Frame</option>
                <option value="metal">Metal Frame</option>
                <option value="wood">Wood Frame</option>
                <option value="glass">Glass Frame</option>
            </select>
        </div>
      </div>

              <Input name="address" type="address" OnChange={this.handleChange} value={this.state.order.address} error={this.state.errors.address}/>
              <div className="mt-8 mb-5">
                <Button name={"Confirm"} type={'submit'} size={"w-80 p-2"} OnClick={""} disable={this.state.errros===null?true:false} />
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
 
export default withRouter(Buyart);