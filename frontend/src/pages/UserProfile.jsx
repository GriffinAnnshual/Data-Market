import Header from "../components/Header"
import image from "../assets/images/profile.jpg"
import {useSelector, useDispatch} from 'react-redux'
import { useState } from "react"
import { setAuthenticatedSuccess } from "../store/modules/auth/actions"
import axios from "axios"
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function UserProfile() {
	const dispatch = useDispatch()
    const user = useSelector(state=> state.auth.user)
	const [formData, setformData] = useState({
		name: user.name,
		email: user.email,
	})
	const handleChange = (e)=>{
		setformData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}
	const handleSave = async()=>{
		console.log("hello")
		await axios.post("http://127.0.0.1:5000/edit-profile",{username: formData.name, email: formData.email},{
		withCredentials: true,	
		headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
		.then((res)=>{
			formData["password"] = user.password;
			dispatch(
				setAuthenticatedSuccess(formData)
			)
			localStorage.setItem("token", JSON.stringify(res.data.token))
			toast.success("Profile updated successfully!")
		})
		.catch(()=>{
			toast.error("Something went wrong!")
		})
	}
	console.log(user)

	return (
		<div>
			<Header />
			<div className="w-full h-10 text-white bg-blue-700 text-center text-xl font-bold p-2">
				Profile Page
			</div>
			<div className="flex text-xl">
				<div className="w-[40%] border-x-2 border-blue-500 h-[80vh] flex justify-center items-center">
					<img
						src={image}
						className="w-[50%] pb-32"></img>
				</div>
				<div className="flex-col w-full">
					<div className="flex-col pb-14 justify-center pt-20 text-white font-bold bg-blue-500 mx-20 mt-10 mb-20">
						<div className="flex justify-evenly p-2    mb-10">
							<p>Username</p>
							<input
								name="name"
								value={formData.name}
								type="text"
								onChange={(e) => handleChange(e)}
								required
								className="border-2 border-white text-lg px-2 text-black rounded-md"></input>
						</div>
						<div className="flex justify-evenly p-2">
							<p>Email</p>
							<input
								name="email"
								value={formData.email}
								type="text"
								onChange={(e) => handleChange(e)}
								required
								className="ml-10 pr-2 border-2 text-black px-2 text-lg border-white rounded-md"></input>
						</div>
					</div>
					<div className="w-full pr-24">
						<div onClick={handleSave}  className="cursor-pointer hover:shadow-md hover:shadow-black text-center font-bold py-2 absolute mr-24 rounded-md right-0  w-32 px-8 bg-blue-500 text-white">
							Save
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserProfile
