import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import ViewOrderInfo from "../../components/viewOrderInfo";
import OrderStatusBadge from "../../components/orderStatusBadge";

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [statusFilter, setStatusFilter] = useState("");

	useEffect(() => {
		if (!loaded) {
			const token = localStorage.getItem("token");
			const query = statusFilter == "" ? "" : "?status=" + statusFilter;

			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/orders/all" + query, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setOrders(response.data.orders);
					setLoaded(true);
				})
				.catch(() => {
					setLoaded(true);
				});
		}
	}, [loaded]);

	function runExpirySweep() {
		const token = localStorage.getItem("token");

		axios
			.post(
				import.meta.env.VITE_BACKEND_URL + "/orders/expire",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then((response) => {
				toast.success(`Released ${response.data.expiredCount} expired reservation(s)`);
				setLoaded(false);
			})
			.catch(() => {
				toast.error("Expiry sweep failed");
			});
	}

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
		<div className="w-full flex flex-col items-center p-10 relative bg-gradient-to-b from-primary to-white text-secondary">
			<div className="w-full max-w-7xl flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">All Orders</h1>
				<div className="flex gap-3">
					<select
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setLoaded(false);
						}}
						className="px-4 py-2 rounded-lg border border-secondary/30 outline-none focus:ring-2 focus:ring-accent"
					>
						<option value="">All statuses</option>
						<option value="RESERVED">Reserved</option>
						<option value="PAID">Paid</option>
						<option value="FAILED">Failed</option>
						<option value="EXPIRED">Expired</option>
						<option value="CANCELLED">Cancelled</option>
					</select>
					<button
						onClick={runExpirySweep}
						className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition"
					>
						Run expiry sweep
					</button>
					<button
						onClick={() => setLoaded(false)}
						className="px-4 py-2 rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-white transition"
					>
						Refresh
					</button>
				</div>
			</div>

			{loaded ? (
				<table className="w-full max-w-7xl table-auto border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-xl bg-white/70">
					<thead className="sticky top-0">
						<tr className="bg-secondary text-primary/95">
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Order ID
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Customer
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Date
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Total
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Attempts
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
									<td className="px-4 py-3 text-sm">{order.customerEmail}</td>
									<td className="px-4 py-3 text-sm">
										{new Date(order.createdAt).toLocaleString()}
									</td>
									<td className="px-4 py-3 text-sm font-semibold">
										LKR. {order.totalAmount.toFixed(2)}
									</td>
									<td className="px-4 py-3 text-sm">{order.paymentAttempts}</td>
									<td className="px-4 py-3 text-sm">
										<OrderStatusBadge status={order.status} />
									</td>
									<td className="px-4 py-3 text-sm">
										<div className="inline-flex items-center gap-2">
											<ViewOrderInfo order={order} />
											{["PENDING", "RESERVED", "PAID"].includes(order.status) && (
												<button
													onClick={() => cancelOrder(order.orderId)}
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
