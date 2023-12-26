import React from 'react'

const AnalystsItem = ({data, title}) => {
  return (
    <div className='w-1/3 bg-white shadow-md shadow-gray-200 p-3 rounded-md h-[10em]'>
        <h1 className='font-semibold text-gray-900 capitalize text-lg'>{title}</h1>
        <div className="w-full flex items-center justify-center h-[70%]">
            <span className='font-bold text-red-500 text-3xl'>{data}</span>
        </div>
    </div>
  )
}

export default AnalystsItem