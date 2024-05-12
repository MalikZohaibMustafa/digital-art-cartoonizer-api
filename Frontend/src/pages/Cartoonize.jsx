import React, { Component } from 'react'
import Heading from '../reuseablecomponents/Heading';
import Footer from '../components/Footer';
import Logo from '../reuseablecomponents/Logo';
import Button from '../reuseablecomponents/Button';
import { Route,withRouter } from 'react-router-dom';
import {auth} from '../firebase';
import Loading from '../reuseablecomponents/Loading';
import axios from 'axios';
import { saveAs } from 'file-saver';
import copy from 'copy-to-clipboard';
import { Link } from 'react-router-dom';


class Cartoonize extends Component {
    state = {  
        currentuser:{name:'',email:''},
        file:null,
        originalimg:null,
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

  handleFile=(e)=>{
    let file=e.target.files[0];
    this.setState({file});
    this.setState({originalimg:null});
    this.setState({genImage:null});
  }



  uploadimg = async () => {
    let file = this.state.file;
    if (!file) {
      alert("Please select an image file to generate art.");
      return;
    }
    this.setState({ originalimg: URL.createObjectURL(file) });
    this.setState({ loadingstatus: true });
    let formdata = new FormData();
    formdata.append('img', file);
  
    try {
      const response = await axios({
        method: "post",
        url: "https://digital-art-cartoonizer-api.onrender.com/submit",
        data: formdata,
        responseType: 'blob', // Important: expects a blob response instead of the default JSON
      });
  
      // Creating a local URL for the blob response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      this.setState({ loadingstatus: false, genImage: url });
  
    } catch (err) {
      console.log(err.message);
    }
  }
  handleBuy = (history) => {
    if (!this.state.genImage) {
      alert("No image generated to buy.");
      return;
    }
    localStorage.setItem("generatedimg", this.state.genImage);
    history.push('/buyart'); // Navigate to the buy page
  }
  

  getimagedownload = () => {
    if (!this.state.genImage) {
      console.log("No image to download.");
      return;
    }
  
    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = this.state.genImage;
    link.setAttribute('download', 'cartoonized.jpeg'); // Specify the download file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  }
  


  getimageshare=()=>{
    copy(this.state.genImage);
    alert("Copied Succesfully");
  }



    render() { 
        return (
            <>
            <div class="flex flex-col bg-gradient-to-r from-cyan-500 to-blue-500 h-screen">
            <div className="flex flex-row flex-wrap bg-blue-50">
        <div className="basis-4/6 lg:basis-5/6 py-3 px-5">
        <Link to="/">
            <Logo />
        </Link>        </div>
            
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

                <div className='flex flex-row flex-wrap justify-center pt-8'>
                    <div className="flex-col text-center">
                        <Heading headingsize="large" headingcontent="Generate Cartoonize Image"/>
                        <div className="mt-9">
                            <input type="file" name="img" multiple accept="image/png, image/jpg, image/jpeg" className="block w-full text-sm text-white
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 cursor-pointer
    "  onChange={this.handleFile} required/>
                        </div>
                        <div className="mt-9">
                            <Button OnClick={this.uploadimg} size={"w-32 h-8"} name={"Generate Art"} disable={this.state.file===null?true:false}/>
                        </div>
                    </div>
                </div>
                
                   {this.state.loadingstatus? <Loading />:''}

                
                
                <div className={`flex flex-row justify-center flex-wrap gap-8 mt-6 pb-6 bg-gradient-to-r from-cyan-500 to-blue-500  ${this.state.genImage===null?'hidden':''}`}>
                    <div className={`lg:basis-2/6 h-2/6 sm:w-4/6 md:basis-3/6 text-center ${this.state.originalimg===null?'hidden':''}`}>
                        <div className="bg-white text-center border-blue-200 border-8 rounded ...">
                        <img src={this.state.originalimg} alt="Original" style={{ width: '100%', height: 'auto', maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                        <span className='text-white font-bold'>Original Image</span>
                    </div>
                    
                    <div className={`lg:basis-2/6 h-2/6 sm:w-4/6 md:basis-3/6 text-center ${this.state.genImage===null?'hidden':''}`}>
                        <div className="bg-white text-center border-blue-200 border-8 rounded ...">
                        <img src={this.state.genImage} alt="Generated Art" style={{ width: '100%', height: 'auto', maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                        <span className='text-white font-bold'>Generated Image</span><br></br>
                        <div className="m-9">
                        <Button size={"w-24"} name="Download" type="submit" OnClick={this.getimagedownload} disable={false} />
                        </div>
                       
                        <div className="m-9">
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
 
export default withRouter(Cartoonize);
