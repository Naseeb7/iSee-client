import { XCircle } from 'lucide-react';
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
         <div className={`flex items-center sm:max-w-fit  gap-2  bg-teal-800 p-3 ${isClosing ? "animate-exitRight" : "animate-enterRight"} rounded-l-lg text-slate-300 sm:text-lg text-sm font-semibold`}>
            {notification}
            <XCircle size={20} className='min-w-min hover:cursor-pointer' onClick={()=>setIsclosing(true)}/>
        </div>
  )
}

export default Notifications
