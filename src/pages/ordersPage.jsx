import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import ViewOrderInfo from "../components/viewOrderInfo";
import OrderStatusBadge from "../components/orderStatusBadge";

export default function OrdersPage() {
	const [orders, setOrders] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token == null) {
			navigate("/login");
			return;
		}

		if (!loaded) {
			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/orders", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setOrders(Array.isArray(response.data) ? response.data : response.data?.orders || []);
					setLoaded(true);
				})
				.catch(() => {
					setLoaded(true);
				});
		}
	}, [loaded]);

	function cancelOrder(orderId) {
		const token = localStorage.getItem("token");

		axios
			.put(
				import.meta.env.VITE_BACKEND_URL + "/orders/" + orderId + "/cancel",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				toast.success(response.data.message);
				setLoaded(false);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "Failed to cancel order");
			});
	}

	return (
		<div className="w-full flex justify-center p-10 relative bg-gradient-to-b from-primary to-white text-secondary">
			{loaded ? (
				<table className="w-full max-w-7xl table-auto border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-xl bg-white/70">
					<thead className="sticky top-0">
						<tr className="bg-secondary text-primary/95">
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Order ID
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Date
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Items
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Total
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Status
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-secondary/10">
						{orders.map((order, index) => {
							return (
								<tr
									key={index}
									className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
								>
									<td className="px-4 py-3 text-sm font-medium text-secondary/90">
										{order.orderId}
									</td>
									<td className="px-4 py-3 text-sm">
										{new Date(order.createdAt).toLocaleString()}
									</td>
									<td className="px-4 py-3 text-sm">{order.items.length}</td>
									<td className="px-4 py-3 text-sm font-semibold">
										LKR. {order.totalAmount.toFixed(2)}
									</td>
									<td className="px-4 py-3 text-sm">
										<OrderStatusBadge status={order.status} />
									</td>
									<td className="px-4 py-3 text-sm">
										<div className="inline-flex items-center gap-2">
											{order.status == "RESERVED" && (
												<button
													onClick={() => {
														navigate("/payment/" + order.orderId);
													}}
													className="px-3 py-2 rounded-md text-center bg-accent text-white hover:bg-accent/80 transition"
												>
													Pay
												</button>
											)}
											<ViewOrderInfo order={order} />
											{["PENDING", "RESERVED", "PAID"].includes(order.status) && (
												<button
													onClick={() => {
														cancelOrder(order.orderId);
													}}
													className="px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
												>
													Cancel
												</button>
											)}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			) : (
				<Loader />
			)}
		</div>
	);
}
