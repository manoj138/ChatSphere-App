import {  LoaderIcon } from 'lucide-react'
import React from 'react'

const PageLoader = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <LoaderIcon className='size-10 animate-spin text-white'/>
    </div>
  )
}

export default PageLoader