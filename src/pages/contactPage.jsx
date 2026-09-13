import { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineEmail, MdOutlinePhone, MdOutlineLocationOn } from "react-icons/md";
import { LuClock } from "react-icons/lu";

export default function ContactPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [isSending, setIsSending] = useState(false);

	function sendMessage() {
		if (name == "" || email == "" || message == "") {
			toast.error("Please fill in your name, email and message");
			return;
		}

		if (!email.includes("@")) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsSending(true);

		//there is no mail endpoint on the Task 01 API, so the message is handed to the
		//visitor's own mail client instead of being posted to the server
		const body =
			"Name: " + name + "%0D%0AEmail: " + email + "%0D%0A%0D%0A" + encodeURIComponent(message);

		window.location.href =
			"mailto:support@techloom.ai?subject=" +
			encodeURIComponent(subject == "" ? "Contact from " + name : subject) +
			"&body=" +
			body;

		toast.success("Opening your mail app...");

		setName("");
		setEmail("");
		setSubject("");
		setMessage("");
		setIsSending(false);
	}

	const details = [
		{
			icon: <MdOutlineEmail className="text-2xl text-accent" />,
			label: "Email",
			value: "support@techloom.ai",
		},
		{
			icon: <MdOutlinePhone className="text-2xl text-accent" />,
			label: "Phone",
			value: "+94 11 234 5678",
		},
		{
			icon: <MdOutlineLocationOn className="text-2xl text-accent" />,
			label: "Address",
			value: "Colombo, Sri Lanka",
		},
		{
			icon: <LuClock className="text-2xl text-accent" />,
			label: "Hours",
			value: "Mon to Fri, 9.00 am to 5.00 pm",
		},
	];

	return (
		<div className="w-full flex flex-col items-center p-10">
			<h1 className="text-4xl lg:text-5xl font-bold text-center">Contact Us</h1>
			<p className="text-lg text-secondary/70 mt-4 text-center max-w-2xl">
				Questions about an order, a reservation that expired, or the system itself? Send us a
				message and we will get back to you.
			</p>

			<div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 mt-10">
				<div className="w-full lg:w-[340px] flex flex-col gap-4">
					{details.map((detail, index) => {
						return (
							<div
								key={index}
								className="bg-white rounded-2xl shadow-2xl p-5 flex items-center gap-4"
							>
								{detail.icon}
								<div>
									<p className="text-xs font-semibold tracking-wide text-secondary/60 uppercase">
										{detail.label}
									</p>
									<p className="text-sm mt-1">{detail.value}</p>
								</div>
							</div>
						);
					})}
				</div>

				<div className="w-full flex-1 bg-white rounded-2xl shadow-2xl p-8">
					<h2 className="text-2xl font-bold mb-6">Send a message</h2>

					<div className="flex flex-col lg:flex-row gap-4">
						<div className="w-full">
							<label className="text-sm">Your name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full h-[45px] rounded-2xl border border-accent px-[20px] focus:outline-none focus:ring-2 focus:ring-accent mt-1"
							/>
						</div>
						<div className="w-full">
							<label className="text-sm">Your email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full h-[45px] rounded-2xl border border-accent px-[20px] focus:outline-none focus:ring-2 focus:ring-accent mt-1"
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="text-sm">Subject</label>
						<input
							type="text"
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className="w-full h-[45px] rounded-2xl border border-accent px-[20px] focus:outline-none focus:ring-2 focus:ring-accent mt-1"
						/>
					</div>

					<div className="mt-4">
						<label className="text-sm">Message</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full h-[160px] rounded-2xl border border-accent px-[20px] py-[12px] focus:outline-none focus:ring-2 focus:ring-accent mt-1"
						/>
					</div>

					<button
						disabled={isSending}
						onClick={sendMessage}
						className="w-full h-[50px] mt-6 bg-accent text-white font-bold rounded-2xl border-2 border-accent hover:bg-transparent hover:text-accent transition disabled:opacity-40"
					>
						Send Message
					</button>
				</div>
			</div>
		</div>
	);
}
