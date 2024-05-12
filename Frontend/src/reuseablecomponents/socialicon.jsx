import React from 'react';

const SocailIcon =({socailiconpath,referpath})=>{
    return(
        <>
            <a href={referpath}>
                    <img
                      src={socailiconpath}
                      alt="socail"
                      width={50}
                      height={50}
                      className="m-3"
                    />
            </a>
        </>
    )
}

export default SocailIcon;