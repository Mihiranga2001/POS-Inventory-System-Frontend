import axios from "axios";
import { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import OrderStatusBadge from "./orderStatusBadge";

export default function ViewOrderInfo(props) {
	const order = props.order;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [payments, setPayments] = useState([]);
	const [statusHistory, setStatusHistory] = useState([]);

	if (!order) return null;

	function formatDateTime(value) {
		if (!value) return "-";
		return new Date(value).toLocaleString();
	}

	function openModal() {
		const token = localStorage.getItem("token");
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/orders/" + order.orderId, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setPayments(response.data.payments);
				setStatusHistory(response.data.order.statusHistory);
				setIsModalOpen(true);
			})
			.catch(() => {
				toast.error("Failed to load order details");
			});
	}

	return (
		<>
			<Modal
				isOpen={isModalOpen}
				onRequestClose={() => setIsModalOpen(false)}
				ariaHideApp={false}
				overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
				className="w-full max-w-3xl mx-4 bg-primary rounded-2xl shadow-2xl outline-none"
			>
				<div className="flex flex-col h-full max-h-[90vh]">
					{/* Header */}
					<div className="flex items-start justify-between border-b border-secondary/10 px-6 py-4">
						<div>
							<h2 className="text-2xl font-bold text-secondary">Order {order.orderId}</h2>
							<p className="text-sm text-secondary/70 mt-1">
								Items, payment attempts and the full status history.
							</p>
						</div>
						<button
							onClick={() => setIsModalOpen(false)}
							className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary/5 text-secondary hover:bg-secondary/10 transition"
							aria-label="Close"
						>
							<span className="text-lg leading-none">&times;</span>
						</button>
					</div>

					{/* Body */}
					<div className="px-6 py-4 space-y-6 overflow-y-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-xs font-semibold tracking-wide text-secondary/60 uppercase">
									Customer
								</p>
								<p className="text-sm">{order.customerEmail}</p>
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wide text-secondary/60 uppercase">
									Status
								</p>
								<OrderStatusBadge status={order.status} />
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wide text-secondary/60 uppercase">
									Placed at
								</p>
								<p className="text-sm">{formatDateTime(order.createdAt)}</p>
							</div>
							<div>
								<p className="text-xs font-semibold tracking-wide text-secondary/60 uppercase">
									Total
								</p>
								<p className="text-sm font-bold">LKR. {order.totalAmount.toFixed(2)}</p>
							</div>
						</div>

						{/* Items */}
						<div>
							<h3 className="text-sm font-bold uppercase text-secondary/70 mb-2">Items</h3>
							<table className="w-full text-sm bg-white rounded-xl overflow-hidden">
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
													<span className="block text-xs text-secondary/50">
														{item.productId}
													</span>
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
						</div>

						{/* Payments */}
						<div>
							<h3 className="text-sm font-bold uppercase text-secondary/70 mb-2">
								Payment attempts
							</h3>
							{payments.length == 0 ? (
								<p className="text-sm text-secondary/60">No payment attempts yet.</p>
							) : (
								<table className="w-full text-sm bg-white rounded-xl overflow-hidden">
									<thead>
										<tr className="bg-secondary text-primary/95">
											<th className="px-3 py-2 text-left">Payment ID</th>
											<th className="px-3 py-2 text-left">Outcome</th>
											<th className="px-3 py-2 text-left">Amount</th>
											<th className="px-3 py-2 text-left">Processed at</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-secondary/10">
										{payments.map((payment, index) => {
											return (
												<tr key={index} className="odd:bg-primary/60 even:bg-white">
													<td className="px-3 py-2">{payment.paymentId}</td>
													<td className="px-3 py-2 font-semibold">{payment.status}</td>
													<td className="px-3 py-2">LKR. {payment.amount.toFixed(2)}</td>
													<td className="px-3 py-2">{formatDateTime(payment.processedAt)}</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							)}
						</div>

						{/* Status history */}
						<div>
							<h3 className="text-sm font-bold uppercase text-secondary/70 mb-2">
								Status history
							</h3>
							<div className="flex flex-col gap-2">
								{statusHistory.map((entry, index) => {
									return (
										<div
											key={index}
											className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 shadow-sm"
										>
											<OrderStatusBadge status={entry.status} />
											<span className="text-sm text-secondary/80">{entry.note}</span>
											<span className="text-xs text-secondary/50 ml-auto">
												{formatDateTime(entry.changedAt)}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</Modal>

			<button
				onClick={openModal}
				className="px-3 py-2 rounded-md text-center bg-accent/20 text-accent hover:bg-accent/30 transition"
			>
				View
			</button>
		</>
	);
}
