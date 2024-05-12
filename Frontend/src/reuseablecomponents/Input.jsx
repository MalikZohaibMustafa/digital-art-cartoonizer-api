import React from 'react';

const Input=({name,type,value,OnChange,error})=>{
  return(<>
    <div className="flex mt-8">
        <div className="w-2/6">
              <label
                htmlFor={name}
                className="text-cyan-900 "
              >
                {name}
              </label>        
        </div>
        <div className="w-4/6">
                <input
                    type={type}
                    id={name}
                    name={name}
                    onChange={OnChange}
                    value={value}
                    className="p-1 border-2 outline-cyan-500 rounded-sm focus:outline-cyan-900"
                    required
                  >
                </input>
        </div>
    </div>
    {error &&
    <div className='flex mt-1'>
      <div className="w-6/12"></div>
        <div role="alert" className='w-4/12'>
          <div className="bg-red-500 text-white rounded p-1" style={{fontSize:10}}>
            {error}
          </div>
        </div>
    </div>
    }
  </>)
}

export default Input;
