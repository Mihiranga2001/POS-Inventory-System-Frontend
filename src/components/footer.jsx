import { Link } from "react-router-dom";

export default function Footer() {
	return (
		<footer className="w-full bg-accent text-primary flex flex-col items-center justify-center py-6 mt-10">
			<h1 className="text-xl font-bold"> POS &amp; Inventory System</h1>
			<p className="text-sm text-primary/70 mt-1">
				Concurrency safe order &amp; inventory system
			</p>
			<div className="flex gap-6 mt-3 text-sm">
				<Link to="/" className="hover:text-gold transition">
					Home
				</Link>
				<Link to="/products" className="hover:text-gold transition">
					Products
				</Link>
				<Link to="/about" className="hover:text-gold transition">
					About
				</Link>
				<Link to="/contact" className="hover:text-gold transition">
					Contact
				</Link>
			</div>
		</footer>
	);
}
