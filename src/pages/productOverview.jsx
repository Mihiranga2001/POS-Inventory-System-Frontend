import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import { addToCart } from "../utils/cart";

export default function ProductOverview() {
	const params = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [status, setStatus] = useState("loading");
	const [quantity, setQuantity] = useState(1);

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/products/" + params.productId)
			.then((response) => {
				setProduct(response.data);
				setStatus("loaded");
			})
			.catch(() => {
				setStatus("error");
			});
	}, [params.productId]);

	if (status == "loading") {
		return <Loader />;
	}

	if (status == "error") {
		return <h1 className="w-full text-center text-2xl p-10">Product not found</h1>;
	}

	const available = product.stock - product.reservedStock;

	return (
		<div className="w-full flex flex-col lg:flex-row justify-center items-center gap-10 p-10">
			<img
				src={product.image}
				className="w-full lg:w-[450px] h-[400px] object-cover rounded-2xl shadow-2xl bg-white"
				onError={(e) => {
					e.target.src = "/default.jpg";
				}}
			/>
			<div className="w-full lg:w-[500px] flex flex-col">
				<h1 className="text-4xl font-bold">{product.name}</h1>
				<p className="text-sm text-secondary/60 mt-1">
					{product.productId} &middot; {product.category}
				</p>
				<p className="text-secondary/80 mt-4">{product.description}</p>

				<h2 className="text-3xl text-accent font-semibold mt-6">
					LKR. {product.price.toFixed(2)}
				</h2>

				<div className="flex gap-4 mt-4">
					<span className="px-3 py-1 rounded-full bg-white shadow text-sm">
						Total stock <b>{product.stock}</b>
					</span>
					<span className="px-3 py-1 rounded-full bg-white shadow text-sm">
						Reserved <b>{product.reservedStock}</b>
					</span>
					<span
						className={
							"px-3 py-1 rounded-full shadow text-sm " +
							(available > 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800")
						}
					>
						Available <b>{available}</b>
					</span>
				</div>

				<div className="flex items-center gap-4 mt-6">
					<label>Quantity</label>
					<input
						type="number"
						min={1}
						value={quantity}
						onChange={(e) => setQuantity(Number(e.target.value))}
						className="w-[100px] h-[40px] rounded-2xl border border-accent px-[20px] focus:outline-none focus:ring-2 focus:ring-accent"
					/>
				</div>

				<div className="flex gap-4 mt-6">
					<button
						disabled={available <= 0}
						onClick={() => {
							if (quantity < 1) {
								toast.error("Quantity must be at least 1");
								return;
							}
							addToCart(product, quantity);
						}}
						className="w-[49%] h-[50px] bg-accent text-white font-bold rounded-2xl border-2 border-accent hover:bg-transparent hover:text-accent transition disabled:opacity-40"
					>
						Add to Cart
					</button>
					<button
						disabled={available <= 0}
						onClick={() => {
							if (quantity < 1) {
								toast.error("Quantity must be at least 1");
								return;
							}
							addToCart(product, quantity);
							navigate("/cart");
						}}
						className="w-[49%] h-[50px] border-2 border-accent text-accent font-bold rounded-2xl hover:bg-accent hover:text-white transition disabled:opacity-40"
					>
						Buy Now
					</button>
				</div>
			</div>
		</div>
	);
}
