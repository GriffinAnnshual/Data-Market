import Header from "../components/Header"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getUser } from "../store/modules/auth/actions"
import axios from 'axios'
function Home() {
	const dispatch = useDispatch();
	const [users, setUsers] = useState([])
	const collect_users = async()=>{
		await axios.get("http://127.0.0.1:5000/users")
		.then((res)=>{
			setUsers(res.data.users)
		})
		.catch((err)=>{
			console.log(err.message)
		})
	} 
	useEffect(() => {	
		collect_users()
		dispatch(getUser());
	}, [dispatch]);

	const cellStyle = {
		padding: "15px 100px",
		textAlign: "center",
	};

	return (
		<>
			<Header />
			<div className="h-[80vh] w-screen flex justify-center items-center">
				<div className="bg-slate-300 w-[96%] h-[95%] p-10">
					<p className="text-xl font-bold mb-4">Profile Registered:</p>
					<table
						className="border-blue-300 border-2"
						style={{ width: "100%" }}>
						<thead>
							<tr className="text-xl bg-white text-blue-500 " >
								<th style={cellStyle}>Sno.</th>
								<th style={cellStyle}>Username</th>
								<th style={cellStyle}>Email</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user, index) => (
								<tr
									key={user.id}
									className={
										(index % 2 === 0 ? "bg-blue-200" : "bg-white") + " text-lg "
									}>
									<td style={cellStyle}>{index + 1}</td>
									<td style={cellStyle}>{user.username}</td>
									<td style={cellStyle}>{user.email}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

export default Home
