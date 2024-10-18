import React from 'react'
import loading from './load.gif'

// const Spinner = () => {
export default function Spinner(){
  return (
    <div className='text-center my-5'>
      <img className='my-3' src={loading} alt="loading" />
    </div>
  )
}

// export default Spinner