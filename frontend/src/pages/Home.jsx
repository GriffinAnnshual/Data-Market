import Header from "../components/Header"

function Home() {
  return (
		<>
			<Header />
			<div className="h-[80vh] w-screen flex justify-center items-center">
				<div className="bg-slate-300 w-[98%] h-[95%]"></div>
			</div>
		</>
	)
}

export default Home