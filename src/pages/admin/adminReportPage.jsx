import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	MdOutlinePayments,
	MdOutlineReceiptLong,
	MdOutlineInventory2,
	MdOutlineTrendingUp,
} from "react-icons/md";
import Loader from "../../components/loader";
import OrderStatusBadge from "../../components/orderStatusBadge";

export default function AdminReportPage() {
	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);
	const [range, setRange] = useState("today");

	//every setState happens inside an async callback, never synchronously in the
	//effect body, which is what react-hooks/set-state-in-effect warns about
	function fetchReport(selectedRange, isActive) {
		const token = localStorage.getItem("token");

		return axios
			.get(import.meta.env.VITE_BACKEND_URL + "/orders/report?range=" + selectedRange, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (!isActive()) {
					return;
				}
				setReport(response.data);
				setLoading(false);
			})
			.catch((err) => {
				if (!isActive()) {
					return;
				}
				console.log("Sales report failed to load:");
				console.log(err);
				toast.error(err.response?.data?.message || "Failed to load the sales report");
				setReport(null);
				setLoading(false);
			});
	}

	useEffect(() => {
		//ignore a slow response from a range the admin has already switched away from
		let active = true;

		fetchReport(range, () => active);

		return () => {
			active = false;
		};
	}, [range]);

	//safe here: a click handler is not an effect
	function refresh() {
		setLoading(true);
		fetchReport(range, () => true);
	}

	const isStale = report != null && report.range != range;

	if (loading) {
		return <Loader />;
	}

	if (report == null) {
		return (
			<div className="w-full flex flex-col items-center p-10">
				<h1 className="text-2xl font-bold">Sales report unavailable</h1>
				<p className="text-sm text-secondary/60 mt-2 text-center max-w-lg">
					The backend did not return a report. Make sure the deployed API includes the
					GET /api/orders/report route and that you are logged in as an admin.
				</p>
				<button
					onClick={refresh}
					className="mt-6 px-6 py-3 rounded-2xl bg-accent text-white font-bold hover:bg-accent/80 transition"
				>
					Try again
				</button>
			</div>
		);
	}

	//every field is defaulted, so an older backend response can never crash the page
	const totalOrders = report.totalOrders || 0;
	const paidOrders = report.paidOrders || 0;
	const revenue = report.revenue || 0;
	const itemsSold = report.itemsSold || 0;
	const averageOrderValue = report.averageOrderValue || 0;
	const statusCounts = report.statusCounts || {};
	const topSelling = Array.isArray(report.topSelling) ? report.topSelling : [];
	const recentOrders = Array.isArray(report.recentOrders) ? report.recentOrders : [];

	const rangeLabels = {
		today: "Today",
		week: "Last 7 days",
		month: "Last 30 days",
		all: "All time",
	};

	const summaryCards = [
		{
			icon: <MdOutlineReceiptLong className="text-3xl text-accent" />,
			label: "Orders",
			value: totalOrders,
			hint: paidOrders + " paid",
		},
		{
			icon: <MdOutlinePayments className="text-3xl text-accent" />,
			label: "Revenue",
			value: "LKR. " + revenue.toFixed(2),
			hint: "paid orders only",
		},
		{
			icon: <MdOutlineInventory2 className="text-3xl text-accent" />,
			label: "Items sold",
			value: itemsSold,
			hint: "units shipped out",
		},
		{
			icon: <MdOutlineTrendingUp className="text-3xl text-accent" />,
			label: "Average order",
			value: "LKR. " + averageOrderValue.toFixed(2),
			hint: "per paid order",
		},
	];

	return (
		<div className="w-full flex flex-col items-center p-10 bg-gradient-to-b from-primary to-white text-secondary">
			<div className="w-full max-w-7xl flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-bold">Sales Report</h1>
					<p className="text-sm text-secondary/60">
						{rangeLabels[report.range] || "Today"} &middot; generated{" "}
						{report.generatedAt ? new Date(report.generatedAt).toLocaleTimeString() : "-"}
						{isStale && <span className="ml-2 text-accent">updating...</span>}
					</p>
				</div>
				<div className="flex gap-3">
					<select
						value={range}
						onChange={(e) => setRange(e.target.value)}
						className="px-4 py-2 rounded-lg border border-secondary/30 outline-none focus:ring-2 focus:ring-accent"
					>
						<option value="today">Today</option>
						<option value="week">Last 7 days</option>
						<option value="month">Last 30 days</option>
						<option value="all">All time</option>
					</select>
					<button
						onClick={refresh}
						className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/80 transition"
					>
						Refresh
					</button>
				</div>
			</div>

			{/* summary cards */}
			<div className="w-full max-w-7xl flex flex-wrap gap-6">
				{summaryCards.map((card, index) => {
					return (
						<div
							key={index}
							className="flex-1 min-w-[240px] bg-white rounded-2xl shadow-xl p-6 flex flex-col"
						>
							{card.icon}
							<p className="text-xs font-semibold tracking-wide text-secondary/60 uppercase mt-3">
								{card.label}
							</p>
							<h2 className="text-3xl font-bold mt-1">{card.value}</h2>
							<p className="text-xs text-secondary/50 mt-1">{card.hint}</p>
						</div>
					);
				})}
			</div>

			{/* status breakdown */}
			<div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-6 mt-6">
				<h2 className="text-lg font-bold mb-4">Orders by status</h2>
				{Object.keys(statusCounts).length == 0 ? (
					<p className="text-sm text-secondary/60">No orders in this period.</p>
				) : (
					<div className="flex flex-wrap gap-3">
						{Object.keys(statusCounts).map((status, index) => {
							return (
								<div
									key={index}
									className="flex items-center gap-2 bg-primary rounded-xl px-4 py-3"
								>
									<OrderStatusBadge status={status} />
									<span className="text-lg font-bold">{statusCounts[status]}</span>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* top selling */}
			<div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-6 mt-6">
				<h2 className="text-lg font-bold mb-4">Top selling products</h2>
				{topSelling.length == 0 ? (
					<p className="text-sm text-secondary/60">
						Nothing has been sold in this period yet.
					</p>
				) : (
					<table className="w-full table-auto border-separate border-spacing-0 rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-secondary text-primary/95">
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									#
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Product
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Product ID
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Units Sold
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Revenue
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-secondary/10">
							{topSelling.map((item, index) => {
								return (
									<tr
										key={index}
										className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
									>
										<td className="px-4 py-3 text-sm font-bold text-secondary/70">
											{index + 1}
										</td>
										<td className="px-4 py-3 text-sm">
											<div className="flex items-center gap-3">
												<img
													src={item.image}
													className="w-[34px] h-[34px] rounded-lg object-cover ring-1 ring-secondary/10"
													onError={(e) => {
														e.target.src = "/default.jpg";
													}}
												/>
												{item.name}
											</div>
										</td>
										<td className="px-4 py-3 text-sm text-secondary/70">{item.productId}</td>
										<td className="px-4 py-3 text-sm font-bold">{item.quantitySold}</td>
										<td className="px-4 py-3 text-sm font-semibold">
											LKR. {(item.revenue || 0).toFixed(2)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			{/* recent orders */}
			<div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl p-6 mt-6">
				<h2 className="text-lg font-bold mb-4">Recent orders</h2>
				{recentOrders.length == 0 ? (
					<p className="text-sm text-secondary/60">No orders in this period.</p>
				) : (
					<table className="w-full table-auto border-separate border-spacing-0 rounded-xl overflow-hidden">
						<thead>
							<tr className="bg-secondary text-primary/95">
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Order ID
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Customer
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Time
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Total
								</th>
								<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
									Status
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-secondary/10">
							{recentOrders.map((order, index) => {
								return (
									<tr
										key={index}
										className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
									>
										<td className="px-4 py-3 text-sm font-medium">{order.orderId}</td>
										<td className="px-4 py-3 text-sm">{order.customerEmail}</td>
										<td className="px-4 py-3 text-sm">
											{new Date(order.createdAt).toLocaleString()}
										</td>
										<td className="px-4 py-3 text-sm font-semibold">
											LKR. {(order.totalAmount || 0).toFixed(2)}
										</td>
										<td className="px-4 py-3 text-sm">
											<OrderStatusBadge status={order.status} />
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
}
