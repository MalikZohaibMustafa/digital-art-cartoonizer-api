import React from 'react';
import Button from './Button';
import '../cssfiles/header.css';
import { Checkmark } from 'react-checkmark'

const Card=({imagepath,name,item1,item2,item3,item4,OnClick})=>{
  return(
    <>
      <div
          className="flex flex-col gap-5 mt-3"
        >
          <div className="rounded-md h-600">
            <img
              src={imagepath}
              alt={name}
              className="border-4
    border-white-500 rounded-2xl img-size ml-auto mr-auto hover:cursor-pointer hover:scale-110"
            />
          </div>
          <div className="ml-auto mr-auto">
            <ol>
              <li className='text-white pb-2'>
                <div className="flex">
                <div className='w-1/6'>
                <Checkmark size='24px'  color='#00FF00'/>
                </div>
                <div className='w-5/6 pl-2'>
                {item1}
                </div>
                </div>
              </li>
              <li className='text-white pb-2'>
                <div className="flex">
                <div className='w-1/6'>
                <Checkmark size='24px'  color='#00FF00'/>
                </div>
                <div className='w-5/6 pl-2'>
                {item2}
                </div>
                </div>
              </li>
              <li className='text-white pb-2'>
                <div className="flex">
                <div className='w-1/6'>
                <Checkmark size='24px'  color='#00FF00'/>
                </div>
                <div className='w-5/6 pl-2'>
                {item3}
                </div>
                </div>
              </li>
              <li className='text-white pb-2'>
                <div className="flex">
                <div className='w-1/6'>
                <Checkmark size='24px'  color='#00FF00'/>
                </div>
                <div className='w-5/6 pl-2'>
                {item4}
                </div>
                </div>
              </li>
              
            </ol>
          </div>
          <div className='ml-auto mr-auto mb-10'>
            <Button OnClick={OnClick} size={"w-80 p-2"} name={"Buy Now"} />
          </div>
        </div>
    </>
  )
}

export default Card;


