import React from 'react';

const Banner=({bannerpath,bannername})=>{
  return(
    <>
      <div className="block basis-6/6 justify-end">
        <img
          src={bannerpath}
          alt={bannername}
          className={"ml-auto mr-auto w-full"}
        ></img>
      </div>
    </>
  )

}

export default Banner;
