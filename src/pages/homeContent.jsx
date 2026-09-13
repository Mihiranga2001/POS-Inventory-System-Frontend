import { Link } from "react-router-dom";
import { LuBoxes, LuTimer } from "react-icons/lu";
import { MdOutlinePayments } from "react-icons/md";
import { BiTransfer } from "react-icons/bi";

export default function Home() {
	return (
		<div className="w-full flex flex-col items-center p-10">
			<h1 className="text-4xl lg:text-5xl font-bold text-center">
				POS Order &amp; Inventory System
			</h1>
			<p className="text-lg text-secondary/70 mt-4 text-center max-w-2xl">
				A concurrency safe point of sale flow: stock is reserved the moment you enter
				checkout, released automatically after 5 minutes, and never oversold no matter how
				many people buy at once.
			</p>

			<div className="flex flex-wrap justify-center gap-6 mt-10">
				<div className="w-[280px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center">
					<LuBoxes className="text-4xl text-accent" />
					<h2 className="text-xl font-semibold mt-3">No overselling</h2>
					<p className="text-sm text-secondary/70 text-center mt-2">
						Reservations are applied with a single atomic stock update, so two buyers can
						never take the same unit.
					</p>
				</div>
				<div className="w-[280px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center">
					<LuTimer className="text-4xl text-accent" />
					<h2 className="text-xl font-semibold mt-3">5 minute hold</h2>
					<p className="text-sm text-secondary/70 text-center mt-2">
						Checkout locks your items for five minutes. If you do not pay, the stock goes
						straight back on the shelf.
					</p>
				</div>
				<div className="w-[280px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center">
					<MdOutlinePayments className="text-4xl text-accent" />
					<h2 className="text-xl font-semibold mt-3">Mock gateway</h2>
					<p className="text-sm text-secondary/70 text-center mt-2">
						Success, failure and timeout outcomes are all handled, and duplicate payments
						are rejected.
					</p>
				</div>
				<div className="w-[280px] bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center">
					<BiTransfer className="text-4xl text-accent" />
					<h2 className="text-xl font-semibold mt-3">Clean lifecycle</h2>
					<p className="text-sm text-secondary/70 text-center mt-2">
						Pending, Reserved, Paid, Cancelled, Expired and Failed, with stock restored on
						every reversal.
					</p>
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
					to="/orders"
					className="px-8 py-3 rounded-2xl border-2 border-accent text-accent font-bold hover:bg-accent hover:text-white transition"
				>
					My orders
				</Link>
			</div>
		</div>
	);
}
