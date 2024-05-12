
import React from 'react';

const Heading=({headingsize,headingcontent})=>{
  
  return(<>
    {headingsize==="large"?<h1 className="text-white font-semibold text-xl  md:text-2xl lg:text-3xl">{headingcontent}</h1>:
    headingsize==="small"?<h3 className='text-white font-semibold text-lg md:text-xl lg:text-2xl '>{headingcontent}</h3>:
    ''}
  </>)
}

export default Heading;
