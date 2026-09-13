import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UserData() {
	const [user, setUser] = useState(null);
	const [selectedOption, setSelectedOption] = useState("user");

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token != null) {
			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/users/", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setUser(response.data);
				})
				.catch(() => {
					setUser(null);
				});
		}
	}, []);

	return (
		<>
			{user ? (
				<div className="w-[170px] flex flex-row items-center">
					<img
						src={user.image}
						referrerPolicy="no-referrer"
						className="w-[50px] rounded-full h-[50px] object-cover"
					/>
					<select
						className="bg-transparent outline-none ml-2 text-white"
						value={selectedOption}
						onChange={(e) => {
							if (e.target.value == "logout") {
								localStorage.removeItem("token");
								window.location.href = "/login";
							} else if (e.target.value == "my-orders") {
								window.location.href = "/orders";
							} else if (e.target.value == "admin") {
								window.location.href = "/admin";
							}
							setSelectedOption("user");
						}}
					>
						<option className="bg-accent" value={"user"}>
							{user.firstName}
						</option>
						<option className="bg-accent" value={"my-orders"}>
							My Orders
						</option>
						{user.role == "admin" && (
							<option className="bg-accent" value={"admin"}>
								Admin Panel
							</option>
						)}
						<option className="bg-accent" value={"logout"}>
							Logout
						</option>
					</select>
				</div>
			) : (
				<div className="w-[200px] flex flex-row">
					<Link to="/login" className="mx-2 px-4 py-2 bg-white text-accent rounded-full">
						Login
					</Link>
					<Link to="/register" className="mx-2 px-4 py-2 bg-white text-accent rounded-full">
						Register
					</Link>
				</div>
			)}
		</>
	);
}
