import React from 'react';
import Paragraph from '../reuseablecomponents/Paragraph';
import Heading from '../reuseablecomponents/Heading';

const ModuleDescription=({onClick, moduleimagepath,modulename,moduleheading,moduledescription,ordermoduleimage,ordermoduledescription})=>{
    return(
        <>
          <div className="module-description-container" onClick={onClick}>
          <div className="flex flex-row flex-wrap justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500 pt-5">
        <div className={`flex flex-row p-10 md:w-2/6 ${ordermoduleimage}`}>
          <div className="p-5 rounded-md">
           <img src={moduleimagepath} alt={modulename} className="border-4
    border-white-500 rounded-2xl h-40 hover:cursor-pointer hover:scale-110 ..."/>
          </div>
        </div>
        <div
          className={`flex flex-col gap-5 md:w-3/6 w-full justify-center p-10 ${ordermoduledescription}`}
        >
          <div>
            <Heading headingsize={"small"} headingcontent={moduleheading} />
          </div>
          <div>
            <Paragraph content={moduledescription} />
          </div>
        </div>
      </div>    </div>
   
        </>
    )
}

export default ModuleDescription;