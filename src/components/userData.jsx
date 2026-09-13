import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserData() {
	const [user, setUser] = useState(null);
	const [selectedOption, setSelectedOption] = useState("user");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token == null) {
			return;
		}

		let active = true;

		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/users/", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (active) {
					setUser(response.data);
				}
			})
			.catch(() => {
				if (active) {
					setUser(null);
				}
			});

		return () => {
			active = false;
		};
	}, []);

	//navigate() keeps everything client side. window.location.href would ask the host
	//for a real /orders file, which 404s on any static host without an SPA rewrite.
	function handleSelect(value) {
		if (value == "logout") {
			localStorage.removeItem("token");
			setUser(null);
			toast.success("Logged out");
			navigate("/login");
		} else if (value == "my-orders") {
			navigate("/orders");
		} else if (value == "admin") {
			navigate("/admin");
		}

		setSelectedOption("user");
	}

	return (
		<>
			{user ? (
				<div className="w-[170px] flex flex-row items-center">
					<img
						src={user.image}
						referrerPolicy="no-referrer"
						className="w-[50px] rounded-full h-[50px] object-cover"
						onError={(e) => {
							e.target.src = "/default.jpg";
						}}
					/>
					<select
						className="bg-transparent outline-none ml-2 text-white"
						value={selectedOption}
						onChange={(e) => {
							handleSelect(e.target.value);
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
