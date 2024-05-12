import React, { Component } from 'react'
import Heading from '../reuseablecomponents/Heading';
import Footer from '../components/Footer';
import Logo from '../reuseablecomponents/Logo';
import Button from '../reuseablecomponents/Button';
import { Route, withRouter } from 'react-router-dom';
import {auth} from '../firebase';
import Loading from '../reuseablecomponents/Loading';
import axios from 'axios';
import { saveAs } from 'file-saver';
import copy from 'copy-to-clipboard';
import { Link } from 'react-router-dom';

class NeutralTransfer extends Component {
    state = {  
        currentuser:{name:'',email:''},
        originalimg:null,
        stylishimg:null,
        genImage: null,
        loadingstatus:false,
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

  handleOriginalimg=e=>{
    let originalimg=e.target.files[0];
    this.setState({originalimg});
  }

  handleStylishimg=e=>{
    let stylishimg=e.target.files[0];
    this.setState({stylishimg});
    this.setState({genImage:null});
  }

  uploadimg=async()=>{
    let content_img=this.state.originalimg;
    let style_img=this.state.stylishimg;
    this.setState({loadingstatus:true});
    let formdata=new FormData();
    formdata.append("content_img", content_img);
    formdata.append("style_img", style_img);

    try{
    let response=await await axios({
        method: "post",
        url: "http://localhost:7000/submit",
        data: formdata,
        headers: { "Content-Type": "multipart/form-data" },
      })
      const imggen=response.data.image;
      this.setState({loadingstatus:false,genImage:imggen});
      console.log(response);
     
    }catch(err)
    {
        console.log(err.message);
        
    }

  }

  getimagedownload=()=>{
    saveAs(this.state.genImage,'artimage.png');
  }

  getimageshare=()=>{
    copy(this.state.genImage);
  }

    render() { 
        return (
            <>
            <div class="flex flex-col bg-gradient-to-r from-cyan-500 to-blue-500 h-screen">
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

                    <form onSubmit={this.uploadimage} enctype="multipart/form-data">
                    <div className='text-center w-100 mt-5'>
                        <Heading headingsize="large" headingcontent="Generate Neutral Transfer Style Image"/>
                    </div>
                    <div className='flex flex-row flex-wrap justify-center mt-8'>
                        <div className="flex-col-6 text-start mb-4">
                            <label name="content_img" className='text-white text-center'>Upload Base Image</label><br></br>
                            <input type="file" name="content_img" accept="image/png, image/jpg, image/jpeg" className="block w-full text-sm text-white
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 cursor-pointer" onChange={this.handleOriginalimg} required/>
                        </div>
                        <div className="flex-col-6 text-start">
                            <label name="style_img"  className='text-white text-center'>Upload Stylish Image</label><br></br>
                            <input type="file" name="style_img" accept="image/png, image/jpg, image/jpeg" className="block w-full text-sm text-white
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 cursor-pointer" onChange={this.handleStylishimg}  required/>
                        </div>
                    </div>
                    </form>
                    <div className='w-full text-center mt-5'>
                        <Button OnClick={this.uploadimg} size={"w-32 h-8"} name={"Generate Art"} disable={this.state.originalimg===null && this.state.stylishimg===null?true:false}/>
                    </div>
                    
                    {this.state.loadingstatus? <Loading />:''}
                
                <div className={`flex flex-row justify-center bg-gradient-to-r from-cyan-500 to-blue-500 flex-wrap gap-8 mt-6 mb-6 ${this.state.genImage===null?'hidden':''}`}>    
                    <div className='h-4/6 text-center'>
                        <div class="bg-white text-center border-blue-200 border-8 rounded ">
                            <img  src={this.state.genImage} alt="Logo" class="object-contain h-56 w-96 ..."/>
                        </div>
                        <span className='text-cyan-600 font-bold'>Generated Image</span><br></br>
                        <div className="m-3">
                        <Button size={"w-24"} name="Download" type="submit" OnClick={this.getimagedownload} disable={false} />
                        </div>
                        <div className="m-3">
                        <Button size={"w-24"} name="Share" type="submit" OnClick={this.getimageshare} disable={false} />
                        </div>
                        <div className="m-3">
                        <Route render={({ history}) => (
                        <Button size={"w-24"} name="Buy" type="submit" disable={false} OnClick={() => { localStorage.setItem("generatedimg", this.state.genImage); history.push('/buyart') }} />)} /> 
                        
                        </div>
                    </div>
                </div>
            
                <div className='sticky top-[100vh]'><Footer /></div>
            </div>
            </>
        );
    }
}
 
export default withRouter(NeutralTransfer) ;

