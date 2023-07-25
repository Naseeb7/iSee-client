import React from 'react'

const Notifications = ({notifications}) => {
    // setTimeout(() => {
    //     notifications=[]
    // }, 5000);
  return (
    notifications &&
    <div className='flex flex-col gap-2 w-1/2 absolute right-0 bottom-20 sm:w-1/4'>
      {notifications.map((reason)=>{
        return <div className='flex bg-teal-200 p-3 animate-slideLeft rounded-l-md text-slate-600 text-lg font-semibold'>
            {reason}
        </div>
      })}
    </div>
  )
}

export default Notifications
