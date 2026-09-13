import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader";

export default function RegisterPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	async function register() {
		if (firstName == "" || lastName == "" || email == "" || password == "") {
			toast.error("Please fill in all fields");
			return;
		}

		setIsLoading(true);
		try {
			await axios.post(import.meta.env.VITE_BACKEND_URL + "/users", {
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: password,
			});

			toast.success("Registration successful! Please login.");
			setIsLoading(false);
			navigate("/login");
		} catch (err) {
			toast.error("Registration failed. That email may already be used.");
			console.log(err);
			setIsLoading(false);
		}
	}

	return (
		<div className="w-full h-screen bg-accent flex">
			<div className="w-[50%] h-full hidden lg:flex justify-center items-center flex-col p-[50px]">
				<h1 className="text-[50px] text-gold text-center font-bold">POS & Inventory System</h1>
				<p className="text-[24px] text-white italic text-center mt-4">
					Create an account to start ordering.
				</p>
			</div>
			<div className="w-full lg:w-[50%] h-full flex justify-center items-center">
				<div className="w-[450px] h-[600px] bg-primary shadow-2xl rounded-2xl flex flex-col justify-center items-center p-[30px]">
					<h1 className="text-[40px] font-bold mb-[20px]">Register</h1>
					<input
						onChange={(e) => setFirstName(e.target.value)}
						type="text"
						placeholder="first name"
						className="w-full h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
					/>
					<input
						onChange={(e) => setLastName(e.target.value)}
						type="text"
						placeholder="last name"
						className="w-full h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
					/>
					<input
						onChange={(e) => setEmail(e.target.value)}
						type="email"
						placeholder="your email"
						className="w-full h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
					/>
					<input
						onChange={(e) => setPassword(e.target.value)}
						type="password"
						placeholder="your password"
						className="w-full h-[50px] mb-[20px] rounded-lg border border-accent p-[10px] text-[20px] focus:outline-none focus:ring-2 focus:ring-gold"
					/>

					<button
						onClick={register}
						className="w-full h-[50px] mb-[20px] bg-accent text-white font-bold text-[20px] rounded-lg border-[2px] border-accent hover:bg-transparent hover:text-accent"
					>
						Register
					</button>
					<p>
						Already have an account?
						<Link to="/login" className="text-gold italic ml-1">
							Login here
						</Link>
					</p>
				</div>
			</div>
			{isLoading && <Loader />}
		</div>
	);
}
