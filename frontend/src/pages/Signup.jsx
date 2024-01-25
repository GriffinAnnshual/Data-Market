/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FcGoogle } from "react-icons/fc"
import { BsTwitterX } from "react-icons/bs"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import check from "../assets/images/check.png"
import warning from "../assets/images/warning.png"
import {useDispatch, useSelector } from "react-redux"
import {setEmailVerified} from '../store/modules/auth/actions'
const Signup = () => {
	const emailVerified = useSelector((state) => state.auth.emailVerified)

	const [formData, setFormData] = useState({
		Name: "",
		email: "",
		password: "",
	})
	const dispatch = useDispatch()


	const handleInputChange = (e) => {
		e.preventDefault()
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	const saveFormData = () => {
		sessionStorage.setItem("formData", JSON.stringify(formData))
	}

	useEffect(() => {
		const storedData = sessionStorage.getItem("formData")

		if (storedData) {
			setFormData(JSON.parse(storedData))
		}
		axios.post("http://127.0.0.1:5000/verify/email",{email:formData.email},{
			headers: {'Content-Type': 'application/json'},
			withCredentials: true,
		}).then(()=> {dispatch(setEmailVerified(true))}).catch((err)=>{console.log("Email Not verified: " + err.message)})

	}, [emailVerified, formData.email, dispatch])

	const handleEmail = () => {
		if (!emailVerified) {
			if (!(formData.email && formData.password && formData.Name)) {
				toast.warning("Please fill all the fields to continue")
				return null
			}
			saveFormData()

			axios
				.post(
					"http://127.0.0.1:5000/send-otp",
					{
						email: formData.email,
						name: formData.Name,
					},
					{
						withCredentials: true,
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then(() => {
					toast.info("Sending Verification Link...")
					setInterval(async () => {
						window.open("http://localhost:5173/verify-email", "_self")
					}, 1000)
				})
				.catch((err) => {
					if (err.response.data.message) {
						toast.error(err.response.data.message);
					}
				})
		}
	}

	const handleSignup = async (e) => {
		e.preventDefault()
		if (!emailVerified) {
			toast.warning("Verify email to continue")
			return null
		}
		await axios
			.post(
				"http://127.0.0.1:5000/register",
				{
					email: formData.email,
					password: formData.password,
					username: formData.Name,
				},
				{
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
			.then((res) => {
				toast.success("Account Created Successfully")
				setInterval(() => {
					window.localStorage.setItem("token", JSON.stringify(res.data.token))
					localStorage.clear()
					sessionStorage.clear()
					window.location.href = "/"
				}, 1000)
			})
			.catch((err) => {
				if (err.response.data.message) {
					toast.error(err.response.data.message)
				}
			})
	}

	const handleGoogle = async () => {
		toast.info("Redirecting to Google")
		window.open("http://localhost:3000/auth/google", "_self")
	}
	const handleTwitter = async () => {
		toast.info("Redirecting to Twitter")
		window.open("http://localhost:3000/auth/twitter", "_self")
	}

	return (
		<div className="font-sans h-[100vh] w-screen flex justify-center items-center bg-blue-600">
			<div className="bg-white rounded-sm flex-col border md:h-[94%] h-[80%] md:w-[35%] w-[90%] p-5 border-solid border-[rgb(231,231,231)] flex justify-center items-center">
				<h2 className="text-2xl mt-12 mb-4 font-mono text-blue-700">
					Create your Account
				</h2>
				<form
					className="rounded-md gap-2 text-base flex-col border-b-neutral-300 w-4/5 px-2.5 py-5 border-b border-solid flex justify-center items-center"
					onSubmit={handleSignup}>
					<input
						className="invalid:border-red-500 w-[100%] m-[5px] p-2.5 bg-slate-200"
						name="Name"
						type="text"
						placeholder="Enter your username"
						value={formData.Name}
						onChange={handleInputChange}
						required
					/>
					<div className="flex items-center w-[100%] px-0 mx-0 py-2.5 gap-2 ">
						<input
							className="invalid:border-red-500 w-[70%] my-[5px] p-2.5 bg-slate-200"
							name="email"
							type="email"
							placeholder="Enter your email"
							value={formData.email}
							onChange={handleInputChange}
							required
						/>
						{emailVerified ? (
							<div
								onClick={handleEmail}
								className=" cursor-pointer w-[25%] text-center border-2 border-blue-500 bg-slate-200 text-black hover:bg-blue-500 hover:text-white rounded-md ">
								<img
									className="w-6 p-1 mx-auto"
									src={check}></img>
								Verified
							</div>
						) : (
							<div
								onClick={handleEmail}
								className=" cursor-pointer w-[25%] text-center border-2 border-blue-500 bg-slate-200 text-black hover:bg-blue-500 hover:text-white rounded-md ">
								<img
									className="w-6 p-1 mx-auto"
									src={warning}></img>
								Verify
							</div>
						)}
					</div>
					<input
						className="w-[100%] m-[5px] p-2.5 bg-slate-200"
						name="password"
						type="password"
						placeholder="Enter your password"
						value={formData.password}
						onChange={handleInputChange}
						required
					/>

					<div className="flex w-full justify-center gap-2 pt-4 pb-2">
						<input
							className="text-xl w-full bg-blue-600 text-[white] cursor-pointer font-mono rounded-md py-1 "
							type="submit"
							id=""
							value="Signup"
						/>
					</div>
					<p className="text-base">
						{"Have"} an account?{" "}
						<Link to="/login">
							<span className="text-blue-700">Login</span>
						</Link>
					</p>
				</form>
				<div className="gap-2 flex rounded-none flex-col py-4 mb-8  whitespace-nowrap justify-center items-center">
					<div
						className=" cursor-pointer bg-slate-200 flex place-items-center rounded-md border-2 border-blue-800 p-1 px-3 gap-2 text-right"
						onClick={handleGoogle}>
						<FcGoogle />
						{"Signup with Google"}
					</div>
					<div
						className=" cursor-pointer bg-slate-200 border-2 rounded-md	 flex place-items-center border-blue-800 p-1 px-4 text-right gap-2"
						onClick={handleTwitter}>
						<BsTwitterX />
						{"Signup  with twitter"}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Signup
