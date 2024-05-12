import React from 'react';
import SocailIcon from "../reuseablecomponents/socialicon";
import Paragraph from '../reuseablecomponents/Paragraph';
import Heading from '../reuseablecomponents/Heading';
import Link from 'react-router-dom/Link';


const Footer=()=>{

  let date=new Date().getFullYear();
  return(
    <>
        <div className="flex flex-wrap text-cyan-900 p-10 bg-gradient-to-r from-sky-400 to-violet-500">
          <div className="flex flex-col md:w-10/12 ">
            <div className='ml-4'>
              <Heading headingsize={"small"} headingcontent={"Join Our Community"} />
            </div>
            <div>
              <div className="flex flex-wrap">
                <div className="socail-media-links hover:scale-110">
                  <SocailIcon socailiconpath={"../assets/discord.png"} referpath={"https://www.google.com"} />
                </div>
                <div className="socail-media-links hover:scale-110">
                  <SocailIcon socailiconpath={"../assets/instagram.png"} referpath={"https://www.google.com"} />
                </div>
                <div className="socail-media-links hover:scale-110">
                  <SocailIcon socailiconpath={"../assets/facebook.png"} referpath={"https://www.google.com"} />
                </div>
                <div className="socail-media-links hover:scale-110">
                  <SocailIcon socailiconpath={"../assets/twitter.png"} referpath={"https://www.google.com"} />
                </div>
              </div>
            </div>
          </div>
        <div className="md:w-2/12 text-white">
          <div className="p-3">
            <Link to="/Tradmark">Trademark Policy</Link>
          </div>
          <div className="p-3">
            <Link to="/teammembers">Meet Our Team</Link>
          </div>
          <div className="p-3">
            <Link to="/contact">Give Feedback</Link>
          </div>
        </div>
      </div>
          <div className='text-cyan-600 text-center  bg-gradient-to-r from-sky-400 to-violet-500'>   
              <Paragraph content={`CopyRight @${date} Digital Art Labs Inc.`}/>
          </div>
      
    </>
  )
}

export default Footer;


