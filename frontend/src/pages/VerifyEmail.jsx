import { Link } from "react-router-dom"
import cartIcon from "../assets/images/shopping-cart.png"
import mailSend from "../assets/images/mail-send.png"
import "react-toastify/dist/ReactToastify.css"

const VerifyMail = () => {
	return (
		<>
			<div className="bg-white h-screen flex justify-center">
				<div className="flex-col justify-center">
					<div className="bg-blue-500 h-[40%] w-screen">
						<div className=" items-center flex flex-row gap-4 py-2 px-4">
							<img
								src={cartIcon}
								className="w-[5%] md:w-[3%]"></img>
							<Link to="/">
								<h1 className="font-montserrat text-xl md:text-2xl font-bold text-[#1b3754]">
									Data Market
								</h1>
							</Link>
						</div>
					</div>
				</div>

				<div className="bg-white w-[90%] md:w-[50%] h-[35%] md:h-[60%] absolute top-32 md:top-10 mx-auto border-black border-2 ">
					<div className="w-max-full mx-auto flex justify-center ">
						<img
							className="w-32 md:w-44"
							src={mailSend}></img>
					</div>
					<div className="text-xl font-montserrat flex justify-center">
						<p>Verification Link Send!</p>
					</div>
					<div className="mx-auto w-[80%] pt-4">
						<p className="text-center text-[1.0rem] font-bold text-green-500">
							An Verification Link has been sent to your email inbox , please
							clik on the verification link sent to your
							mail, to verify your email.
						</p>
					</div>
					<a
						href="/register"
						className="flex font-bold justify-start w-[30%] text-sm p-2 text-blue-700">
						{"< Back to signup page"}
					</a>
				</div>
			</div>
		</>
	)
}

export default VerifyMail
