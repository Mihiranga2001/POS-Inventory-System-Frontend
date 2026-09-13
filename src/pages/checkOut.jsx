import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsChevronUp } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import { createIdempotencyKey } from "../utils/cart";

export default function CheckoutPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [cart, setCart] = useState(location.state);
	const [isLoading, setIsLoading] = useState(false);

	//one key per checkout screen, so a double click can never create two orders
	const [idempotencyKey] = useState(createIdempotencyKey("chk"));

	if (location.state == null) {
		navigate("/products");
		return null;
	}

	function getCartTotal() {
		let total = 0;
		cart.forEach((item) => {
			total += item.price * item.quantity;
		});
		return total;
	}

	function reserveAndContinue() {
		const token = localStorage.getItem("token");
		if (token == null) {
			toast.error("You must be logged in to place an order");
			navigate("/login");
			return;
		}

		if (cart.length == 0) {
			toast.error("Your cart is empty");
			return;
		}

		const orderItems = [];
		cart.forEach((item) => {
			orderItems.push({
				productId: item.productId,
				quantity: item.quantity,
			});
		});

		setIsLoading(true);

		axios
			.post(
				import.meta.env.VITE_BACKEND_URL + "/orders/checkout",
				{
					items: orderItems,
					idempotencyKey: idempotencyKey,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				setIsLoading(false);

				if (response.data.duplicate) {
					toast.success("This checkout was already submitted, opening the same order");
				} else {
					toast.success("Stock reserved for 5 minutes. Complete your payment.");
				}

				navigate("/payment/" + response.data.order.orderId);
			})
			.catch((err) => {
				setIsLoading(false);
				const message = err.response?.data?.message || "Checkout failed";
				toast.error(message);
			});
	}

	return (
		<div className="w-full flex flex-col items-center p-[20px]">
			<div className="w-full lg:w-[50%] bg-white rounded-xl shadow-2xl p-4 mb-2">
				<h1 className="text-2xl font-bold">Checkout</h1>
				<p className="text-sm text-secondary/70 mt-1">
					Confirming this reserves your items for 5 minutes. If you do not pay inside the
					window the stock is released automatically.
				</p>
			</div>

			{cart.map((item, index) => {
				return (
					<div
						key={index}
						className="w-full lg:w-[50%] lg:h-[150px] pt-[20px] relative rounded-xl overflow-hidden shadow-2xl my-1 flex justify-between bg-white"
					>
						<h1 className="lg:hidden w-full overflow-hidden h-[20px] absolute top-[0px]">
							{item.name}
						</h1>
						<div className="h-full flex flex-col">
							<img
								src={item.image}
								className="w-[80px] lg:h-full aspect-square object-cover"
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
										const copiedCart = [...cart];
										copiedCart[index].quantity += 1;
										setCart(copiedCart);
									}}
									className="text-2xl cursor-pointer hover:text-accent transition"
								/>
								<span className="text-lg">{item.quantity}</span>
								<BsChevronUp
									onClick={() => {
										const copiedCart = [...cart];
										copiedCart[index].quantity -= 1;
										if (copiedCart[index].quantity < 1) {
											copiedCart.splice(index, 1);
										}
										setCart(copiedCart);
									}}
									className="rotate-180 text-2xl cursor-pointer hover:text-accent transition"
								/>
							</div>
							<span className="pr-4 text-lg font-semibold w-[150px] text-right">
								LKR. {(item.price * item.quantity).toFixed(2)}
							</span>
						</div>
					</div>
				);
			})}

			<div className="w-full lg:w-[50%] h-[150px] rounded-xl overflow-hidden shadow-2xl my-1 flex justify-between items-center bg-white">
				<button
					disabled={isLoading}
					onClick={reserveAndContinue}
					className="self-center ml-4 px-6 py-3 rounded bg-accent text-white hover:bg-accent/90 transition disabled:opacity-40"
				>
					Reserve Stock &amp; Pay
				</button>
				<span className="pr-4 text-xl font-bold min-w-[150px] text-right">
					LKR. {getCartTotal().toFixed(2)}
				</span>
			</div>

			{isLoading && <Loader />}
		</div>
	);
}
