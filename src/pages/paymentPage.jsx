import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/loader";
import CountDown from "../components/countDown";
import OrderStatusBadge from "../components/orderStatusBadge";
import { createIdempotencyKey, emptyCart } from "../utils/cart";

//the mock payment gateway screen.
//success / failure / timeout can be forced so every branch is demonstrable,
//and the duplicate button replays the exact same idempotency key.
export default function PaymentPage() {
	const params = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const [isPaying, setIsPaying] = useState(false);
	const [lastResult, setLastResult] = useState(null);
	const [paymentKey, setPaymentKey] = useState(createIdempotencyKey("pay"));

	function loadOrder() {
		const token = localStorage.getItem("token");
		if (token == null) {
			navigate("/login");
			return;
		}

		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/orders/" + params.orderId, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setOrder(response.data.order);
				setLoaded(true);
			})
			.catch(() => {
				toast.error("Order not found");
				setLoaded(true);
			});
	}

	useEffect(() => {
		loadOrder();
	}, [params.orderId]);

	function pay(simulate, reuseKey) {
		const token = localStorage.getItem("token");
		const key = reuseKey ? paymentKey : createIdempotencyKey("pay");

		if (!reuseKey) {
			setPaymentKey(key);
		}

		setIsPaying(true);

		axios
			.post(
				import.meta.env.VITE_BACKEND_URL + "/payments/" + params.orderId,
				{
					simulate: simulate,
					idempotencyKey: key,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				setIsPaying(false);
				setLastResult(response.data);

				if (response.data.duplicate) {
					toast.success("Duplicate payment blocked, the original result was returned");
				} else {
					toast.success("Payment successful");
					emptyCart();
				}

				loadOrder();
			})
			.catch((err) => {
				setIsPaying(false);
				setLastResult(err.response?.data || null);

				const message = err.response?.data?.message || "Payment failed";
				toast.error(message);

				loadOrder();
			});
	}

	function cancelOrder() {
		const token = localStorage.getItem("token");

		axios
			.put(
				import.meta.env.VITE_BACKEND_URL + "/orders/" + params.orderId + "/cancel",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				toast.success(response.data.message);
				loadOrder();
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "Failed to cancel order");
			});
	}

	if (!loaded) {
		return <Loader />;
	}

	if (order == null) {
		return <h1 className="w-full text-center text-2xl p-10">Order not found</h1>;
	}

	const isPayable = order.status == "RESERVED";

	return (
		<div className="w-full flex flex-col items-center p-[20px]">
			<div className="w-full lg:w-[60%] bg-white rounded-xl shadow-2xl p-6">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-2xl font-bold">Payment for {order.orderId}</h1>
						<p className="text-sm text-secondary/70 mt-1">{order.customerEmail}</p>
					</div>
					<OrderStatusBadge status={order.status} />
				</div>

				{isPayable && (
					<div className="mt-6 flex flex-col items-center bg-primary rounded-xl p-4">
						<p className="text-sm text-secondary/70">Reservation expires in</p>
						<CountDown
							expiresAt={order.reservationExpiresAt}
							onExpire={() => {
								toast.error("The reservation expired and the stock was released");
								loadOrder();
							}}
						/>
						<p className="text-xs text-secondary/60 mt-1">
							Your items are locked until then, nobody else can buy them.
						</p>
					</div>
				)}

				<table className="w-full text-sm mt-6 rounded-xl overflow-hidden">
					<thead>
						<tr className="bg-secondary text-primary/95">
							<th className="px-3 py-2 text-left">Product</th>
							<th className="px-3 py-2 text-left">Unit Price</th>
							<th className="px-3 py-2 text-left">Qty</th>
							<th className="px-3 py-2 text-left">Line Total</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-secondary/10">
						{order.items.map((item, index) => {
							return (
								<tr key={index} className="odd:bg-primary/60 even:bg-white">
									<td className="px-3 py-2">
										{item.name}
										<span className="block text-xs text-secondary/50">{item.productId}</span>
									</td>
									<td className="px-3 py-2">LKR. {item.price.toFixed(2)}</td>
									<td className="px-3 py-2">{item.quantity}</td>
									<td className="px-3 py-2 font-semibold">
										LKR. {(item.price * item.quantity).toFixed(2)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>

				<div className="w-full flex justify-end mt-4">
					<span className="text-xl font-bold">
						Total: LKR. {order.totalAmount.toFixed(2)}
					</span>
				</div>

				{isPayable ? (
					<div className="mt-8">
						<h2 className="text-lg font-semibold mb-3">Mock payment gateway</h2>
						<div className="flex flex-wrap gap-3">
							<button
								disabled={isPaying}
								onClick={() => pay("success", false)}
								className="px-6 py-3 rounded-2xl bg-accent text-white font-bold border-2 border-accent hover:bg-transparent hover:text-accent transition disabled:opacity-40"
							>
								Pay Now
							</button>
							
							<button
								disabled={isPaying}
								onClick={cancelOrder}
								className="px-6 py-3 rounded-2xl bg-gray-500 text-white font-bold hover:bg-gray-600 transition disabled:opacity-40"
							>
								Cancel order
							</button>
						</div>
						<p className="text-xs text-secondary/60 mt-3">
							Duplicate payments reuse the same idempotency key: the gateway returns the
							original result instead of charging twice.
						</p>
					</div>
				) : (
					<div className="mt-8 flex flex-wrap gap-3">
						<button
							onClick={() => navigate("/orders")}
							className="px-6 py-3 rounded-2xl bg-accent text-white font-bold border-2 border-accent hover:bg-transparent hover:text-accent transition"
						>
							Go to my orders
						</button>
						<button
							onClick={() => navigate("/products")}
							className="px-6 py-3 rounded-2xl border-2 border-accent text-accent font-bold hover:bg-accent hover:text-white transition"
						>
							Continue shopping
						</button>
					</div>
				)}

				{lastResult != null && (
					<div className="mt-6 bg-primary rounded-xl p-4">
						<h3 className="text-sm font-bold uppercase text-secondary/70 mb-2">
							Last gateway response
						</h3>
						<p className="text-sm">{lastResult.message}</p>
						{lastResult.payment && (
							<p className="text-xs text-secondary/60 mt-1">
								{lastResult.payment.paymentId} &middot; {lastResult.payment.status} &middot;{" "}
								{lastResult.payment.gatewayReference}
							</p>
						)}
					</div>
				)}
			</div>

			{isPaying && <Loader />}
		</div>
	);
}
