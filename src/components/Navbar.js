import { useDispatch, useSelector } from "react-redux"
import { setName } from "../reducers"


const Navbar = () => {
  const dispatch= useDispatch()
  const name=useSelector((state)=>state.name)
  
  const nameChange=(e)=> {
    dispatch(setName({name : e.target.value}))
  }

  return (
    <div className='flex justify-between bg-slate-200 p-2'>
      <div className="flex px-2 text-4xl font-bold text-teal-600">iSee</div>
      <div className="flex items-center justify-end p-1 sm:px-4 text-xl text-slate-600">
          <input type="text" onChange={nameChange} value={name} placeholder="Pick a name" className="bg-slate-200 text-right focus:outline-none text-teal-600 w-2/4"/>'s session
      </div>
    </div>
  )
}

export default Navbar
