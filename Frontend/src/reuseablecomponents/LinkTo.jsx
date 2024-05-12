import React from 'react';
import { Link } from 'react-router-dom';

const LinkTo=({type,name,Referto})=>{
    return (
        <>
        {type?
        <a
          href={Referto}
          className="text-cyan-600 hover:text-cyan-400 text-sm cursor-pointer font-bold hover-underline-animation "
        >
         {name}
        </a>:
        <Link
          href={Referto}
          className="text-cyan-600 hover:text-cyan-400 text-sm cursor-pointer font-bold hover-underline-animation "
        >
         {name}
        </Link>}
        </>
    )
}

export default LinkTo;