import React from 'react';

const Paragraph=({content})=>{
    return(
        <>
         <p className=" text-white text-base sm:text-lg md:text-lg lg:text-1xl xl:text-1xl">
            {content}
        </p>
        </>
    )
}

export default Paragraph;