import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const Notifications = ({ notification , onDelete, autoClose=false }) => {
    const [isClosing,setIsclosing]=useState(false)

    useEffect(()=>{
        if(isClosing){
            const timeout=setTimeout(onDelete, 300);
            return ()=>{
                clearTimeout(timeout)
            }
        }
    },[isClosing,onDelete])

    useEffect(()=>{
        if(autoClose){
            const timeout=setTimeout(()=>setIsclosing(true), 7*1000);
            return ()=>{
                clearTimeout(timeout)
            }
        }
    },[autoClose])
  return (
         <div className={`flex items-center sm:max-w-fit  gap-2  bg-teal-200 p-3 ${isClosing ? "animate-slideRight" : "animate-slideLeft"} rounded-l-md text-slate-600 sm:text-lg text-sm font-semibold`}>
            {notification}
            <X size={18} className='min-w-min hover:cursor-pointer' onClick={()=>setIsclosing(true)}/>
        </div>
  )
}

export default Notifications
