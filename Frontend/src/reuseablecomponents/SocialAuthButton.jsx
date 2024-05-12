import React from 'react';

const SocialAuthButton=({imagepath,name,OnClick})=>{
    return(
        <>
            <div
                  className="md:w-2/6 w-5/6 mb-5 flex justify-center cursor-pointer hover:bg-cyan-400;"
                  style={{ border: "3px solid #0891b2", borderRadius: "10px" }}
                  onClick={OnClick}
                >
                  <div>
                    <img
                      src={imagepath}
                      width="50"
                      height="50"
                      alt={name}
                    />
                  </div>
                  <div className="mt-5 ml-5">
                    <h4>{name}</h4>
                  </div>
                </div>
        </>
    )
}

export default SocialAuthButton;