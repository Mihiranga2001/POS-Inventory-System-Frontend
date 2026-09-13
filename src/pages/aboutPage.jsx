import { Link } from "react-router-dom";
import { LuBoxes, LuTimer, LuShieldCheck } from "react-icons/lu";
import { MdOutlinePayments } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";
import { AiOutlineDatabase } from "react-icons/ai";

export default function AboutPage() {
	const features = [
		{
			icon: <LuBoxes className="text-3xl text-accent" />,
			title: "Atomic stock reservation",
			text: "Every reservation is a single conditional update inside one document lock, so two buyers can never claim the same unit. When stock runs out the request is rejected instead of oversold.",
		},
		{
			icon: <LuTimer className="text-3xl text-accent" />,
			title: "Five minute hold",
			text: "Entering checkout locks your items for five minutes. A background sweeper releases anything left unpaid, and the countdown on the payment screen shows exactly how long is left.",
		},
		{
			icon: <MdOutlinePayments className="text-3xl text-accent" />,
			title: "Mock payment gateway",
			text: "Success, failure and timeout are all handled distinctly: confirm the order, release the stock, or expire the reservation. Duplicate submissions never create a second charge.",
		},
		{
			icon: <BiTransfer className="text-3xl text-accent" />,
			title: "Explicit order lifecycle",
			text: "Pending, Reserved, Processing, Paid, Failed, Expired and Cancelled, with only valid transitions permitted and a full status history kept on every order.",
		},
		{
			icon: <AiOutlineDatabase className="text-3xl text-accent" />,
			title: "Transactional integrity",
			text: "Stock movements and order updates commit together inside a database transaction, so a failure part way through can never leave inventory and orders disagreeing.",
		},
		{
			icon: <LuShieldCheck className="text-3xl text-accent" />,
			title: "Duplicate protection",
			text: "Idempotency keys, a locked cart during checkout, an atomic status flip before payment, and a unique database index that makes a second successful charge impossible.",
		},
	];

	return (
		<div className="w-full flex flex-col items-center p-10">
			<h1 className="text-4xl lg:text-5xl font-bold text-center">About Techloom POS</h1>
			<p className="text-lg text-secondary/70 mt-4 text-center max-w-3xl">
				A point of sale ordering system built around one hard problem: keeping inventory
				honest when many people buy the same limited item at the same moment.
			</p>

			<div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 mt-10">
				<h2 className="text-2xl font-bold">The problem</h2>
				<p className="text-secondary/80 mt-3">
					A naive store reads the stock count, checks whether it is enough, then writes the
					new value. Between the read and the write another request can do exactly the same
					thing, and both succeed. With three units left and ten simultaneous buyers you can
					easily sell seven items you do not have.
				</p>
				<h2 className="text-2xl font-bold mt-8">The approach</h2>
				<p className="text-secondary/80 mt-3">
					Stock is split into what physically exists and what is currently locked by a live
					checkout. Availability is the difference between the two. Reserving is one atomic
					operation that checks and decrements together, so the gap that causes overselling
					never opens. Everything else follows from that: reservations expire on their own,
					failed payments release their hold, and cancelled orders return their units.
				</p>
			</div>

			<div className="w-full max-w-6xl flex flex-wrap justify-center gap-6 mt-10">
				{features.map((feature, index) => {
					return (
						<div
							key={index}
							className="w-[340px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col"
						>
							{feature.icon}
							<h3 className="text-xl font-semibold mt-3">{feature.title}</h3>
							<p className="text-sm text-secondary/70 mt-2">{feature.text}</p>
						</div>
					);
				})}
			</div>

			<div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8 mt-10">
				<h2 className="text-2xl font-bold">Built with</h2>
				<div className="flex flex-wrap gap-3 mt-4">
					{[
						"React 19",
						"Vite",
						"Tailwind CSS v4",
						"Node.js",
						"Express",
						"MongoDB",
						"Mongoose",
						"JWT",
						"axios",
					].map((tech, index) => {
						return (
							<span
								key={index}
								className="px-4 py-2 rounded-full bg-primary text-sm font-medium shadow-sm"
							>
								{tech}
							</span>
						);
					})}
				</div>
			</div>

			<div className="flex gap-4 mt-12">
				<Link
					to="/products"
					className="px-8 py-3 rounded-2xl bg-accent text-white font-bold border-2 border-accent hover:bg-transparent hover:text-accent transition"
				>
					Browse Products
				</Link>
				<Link
					to="/contact"
					className="px-8 py-3 rounded-2xl border-2 border-accent text-accent font-bold hover:bg-accent hover:text-white transition"
				>
					Contact Us
				</Link>
			</div>
		</div>
	);
}
