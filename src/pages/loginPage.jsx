import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	async function login() {
		setIsLoading(true);
		try {
			const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/login", {
				email: email,
				password: password,
			});

			localStorage.setItem("token", res.data.token);

			if (res.data.role == "admin") {
				navigate("/admin");
			} else {
				navigate("/");
			}

			toast.success("Login successful! Welcome back.");
			setIsLoading(false);
		} catch (err) {
			toast.error("Login failed! Please check your credentials and try again.");
			console.log("Error during login:");
			console.log(err);
			setIsLoading(false);
		}
	}

	return (
		<div className="w-full h-screen bg-accent flex">
			<div className="w-[50%] h-full hidden lg:flex justify-center items-center flex-col p-[50px]">
				<h1 className="text-[50px] text-gold text-center font-bold">TECHLOOM POS</h1>
				<p className="text-[24px] text-white italic text-center mt-4">
					Reserve. Pay. Never oversell.
				</p>
			</div>
			<div className="w-full lg:w-[50%] h-full flex justify-center items-center">
				<div className="w-[450px] h-[520px] bg-primary shadow-2xl rounded-2xl flex flex-col justify-center items-center p-[30px]">
					<h1 className="text-[40px] font-bold mb-[20px]">Login</h1>
					<input
						onChange={(e) => {
							setEmail(e.target.value);
						}}
						type="email"
						placeholder="your email"
						className="w-full h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
					/>
					<input
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						type="password"
						placeholder="your password"
						className="w-full h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
					/>

					<button
						onClick={login}
						className="w-full h-[50px] mb-[20px] bg-accent text-white font-bold text-[20px] rounded-lg border-[2px] border-accent hover:bg-transparent hover:text-accent"
					>
						Login
					</button>
					<p>
						Don't have an account?
						<Link to="/register" className="text-gold italic ml-1">
							Register here
						</Link>
					</p>
					<p className="text-xs text-secondary/60 mt-6 text-center">
						Seeded demo accounts
						<br />
						admin@techloom.ai / admin123
						<br />
						customer@techloom.ai / customer123
					</p>
				</div>
			</div>
			{isLoading && <Loader />}
		</div>
	);
}
