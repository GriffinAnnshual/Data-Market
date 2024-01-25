
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import { logout } from '../store/modules/auth/actions'
import {FaRegUserCircle} from 'react-icons/fa'
function Header() {
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const handleLogin = () =>{
    window.location.href = "/login"
  }
  const handleSignup = () =>{
    window.location.href = "/register"
  }

  const handleProfile = () =>{
    window.location.href = "/profile"
  }
  const handleLogout = async () => {
			try {
				await axios.get(
						"http://127.0.0.1:5000/logout",
						{
							withCredentials: true,
							headers: {
								"Content-Type": "application/json",
							},
						}
					)
					.then(() => {
						dispatch(logout())
						localStorage.removeItem("token")
						toast.info("Logged out!")
						setInterval(() => {
							window.location.reload()
						}, 1000)
					})
			} catch (err) {
				if (err.response.data.message) {
					toast.error(err.response.data.message)
				}
			}
		}
  const isAuthenticated = useSelector(state=> state.auth.isAuthenticated);
  return (
		<div className="justify-center items-center flex w-screen h-[20vh] bg-blue-500">
			<div className="">
				<h1 className="text-5xl text-white font-bold">Data Market</h1>
			</div>
			<div className="absolute right-0 flex gap-10 pr-[5%]">
				{!isAuthenticated ? (
					<>
						<div
							onClick={handleLogin}
							className="px-4 py-2 text-xl text-blue-500 cursor-pointer rounded-md hover:shadow-md hover:shadow-black font-bold bg-white">
							Login
						</div>
						<div
							onClick={handleSignup}
							className="px-4 py-2 text-xl text-blue-500 cursor-pointer rounded-md hover:shadow-md hover:shadow-black font-bold bg-white">
							Register
						</div>
					</>
				) : (
					<>
						<div className="relative group">
							<div className="px-4 gap-2 flex rounded-sm  py-2 text-xl text-blue-500 cursor-pointer font-bold bg-white">
							<FaRegUserCircle
							className="h-4 md:h-8"
							size={40}
							/>	{user.name}
							</div>
							<div className="bg-white text-blue-500 font-bold  p-2 absolute z-10 px-[13%] pr-[17%] hidden group-hover:block">
								<div onClick={handleProfile} className="text-xl px-4 cursor-pointer">Profile</div>
								<hr className="border-blue-500 border-1 w-full rounded-md" />
								<div onClick={handleLogout} className="text-xl px-4 cursor-pointer">Logout</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default Header