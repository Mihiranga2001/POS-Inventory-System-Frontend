import { useState } from "react";
import { addToCart, getCart, getCartTotal, removeFromCart } from "../utils/cart";
import { BsChevronUp } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function CartPage() {
	const [cart, setCart] = useState(getCart());

	return (
		<div className="w-full flex flex-col items-center p-[20px]">
			{cart.length == 0 && (
				<div className="w-full lg:w-[50%] flex flex-col items-center p-10 rounded-xl shadow-2xl">
					<h1 className="text-2xl">Your cart is empty</h1>
					<Link
						to="/products"
						className="mt-4 px-6 py-3 rounded bg-accent text-white hover:bg-accent/90 transition"
					>
						Browse products
					</Link>
				</div>
			)}

			{cart.map((item, index) => {
				return (
					<div
						key={index}
						className="w-full lg:w-[50%] pt-[20px] relative lg:h-[150px] rounded-xl overflow-hidden shadow-2xl my-1 flex justify-between bg-white"
					>
						<h1 className="lg:hidden w-full overflow-hidden h-[20px] absolute top-[0px]">
							{item.name}
						</h1>
						<div className="h-full flex flex-col">
							<img
								src={item.image}
								className="h-[80px] lg:h-full aspect-square object-cover"
								onError={(e) => {
									e.target.src = "/default.jpg";
								}}
							/>
						</div>
						<div className="hidden lg:flex flex-col justify-center pl-4 w-[300px]">
							<h1 className="text-2xl font-semibold">
								{item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}
							</h1>
							<h2 className="text-xl text-accent font-semibold mt-2">
								LKR. {item.price.toFixed(2)}
							</h2>
							<h3 className="text-sm mt-2 text-secondary/60">{item.productId}</h3>
						</div>
						<div className="min-h-full flex flex-row items-center gap-4">
							<div className="h-full flex flex-col justify-center items-center">
								<BsChevronUp
									onClick={() => {
										addToCart(item, 1);
										setCart(getCart());
									}}
									className="text-2xl cursor-pointer hover:text-accent transition"
								/>
								<span className="text-lg">{item.quantity}</span>
								<BsChevronUp
									onClick={() => {
										addToCart(item, -1);
										setCart(getCart());
									}}
									className="rotate-180 text-2xl cursor-pointer hover:text-accent transition"
								/>
							</div>
							<span className="text-lg font-semibold w-[150px] text-right">
								LKR. {(item.price * item.quantity).toFixed(2)}
							</span>
							<button
								onClick={() => {
									removeFromCart(item.productId);
									setCart(getCart());
								}}
								className="mr-4 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
							>
								Remove
							</button>
						</div>
					</div>
				);
			})}

			{cart.length > 0 && (
				<div className="w-full lg:w-[50%] h-[150px] rounded-xl overflow-hidden shadow-2xl my-1 flex justify-between items-center bg-white">
					<Link
						to="/checkout"
						className="self-center ml-4 px-6 py-3 rounded bg-accent text-white hover:bg-accent/90 transition"
						state={cart}
					>
						Checkout
					</Link>
					<span className="pr-4 text-xl font-bold w-[150px] text-right">
						LKR. {getCartTotal().toFixed(2)}
					</span>
				</div>
			)}
		</div>
	);
}
