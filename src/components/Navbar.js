import { useDispatch, useSelector } from "react-redux"
import { setName } from "../reducers"
import { useEffect, useState } from "react"
import multiavatar from '@multiavatar/multiavatar/esm'


const Navbar = () => {
  const [avatar, setAvatar] = useState()
  const dispatch = useDispatch()
  const name = useSelector((state) => state.name)
  const onCall = useSelector((state) => state.onCall)

  const updateAvatar = (Name) => {
    if (Name.length) {
      const svgCode = multiavatar(Name)
      document.getElementById("avatar").innerHTML = svgCode;
    } else {
      const svgCode = multiavatar("Pradosh")
      document.getElementById("avatar").innerHTML = svgCode;
    }
  }
  useEffect(() => {
    updateAvatar(name);
  }, [])


  const nameChange = (e) => {
    if (!onCall) {
      dispatch(setName({ name: e.target.value }))
      updateAvatar(e.target.value);
    }
  }

  return (
    <div className='flex justify-between items-center bg-slate-200 p-2'>
      <div className="flex px-2 sm:text-4xl text-2xl font-bold text-teal-600">iSee</div>
      <div className="flex">
        <div className="flex items-center justify-end gap-2 p-1 sm:px-4 sm:text-xl text-slate-600">
          <input id="name" type="text" onChange={nameChange} value={name} placeholder="Pick a name" className="bg-slate-200 text-right focus:outline-none text-teal-600 w-3/4" />
          <div id="avatar" className=" w-1/6"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
