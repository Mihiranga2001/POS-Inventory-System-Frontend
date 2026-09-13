import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/loader";

//live inventory board. auto refreshes so you can watch reserved stock move
//while concurrent checkouts are running.
export default function StockPage() {
	const [stockLevels, setStockLevels] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [generatedAt, setGeneratedAt] = useState(null);
	const [autoRefresh, setAutoRefresh] = useState(true);

	function loadStock() {
		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/products/stock/all")
			.then((response) => {
				setStockLevels(response.data.stockLevels);
				setGeneratedAt(response.data.generatedAt);
				setLoaded(true);
			})
			.catch(() => {
				setLoaded(true);
			});
	}

	useEffect(() => {
		loadStock();

		if (!autoRefresh) {
			return;
		}

		const interval = setInterval(loadStock, 3000);
		return () => clearInterval(interval);
	}, [autoRefresh]);

	return (
		<div className="w-full flex flex-col items-center p-10 bg-gradient-to-b from-primary to-white text-secondary">
			<div className="w-full max-w-7xl flex justify-between items-center mb-4">
				<div>
					<h1 className="text-2xl font-bold">Live Stock Levels</h1>
					<p className="text-sm text-secondary/60">
						Updated {generatedAt ? new Date(generatedAt).toLocaleTimeString() : "-"}
					</p>
				</div>
				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={autoRefresh}
						onChange={(e) => setAutoRefresh(e.target.checked)}
					/>
					Auto refresh every 3s
				</label>
			</div>

			{loaded ? (
				<table className="w-full max-w-7xl table-auto border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-xl bg-white/70">
					<thead className="sticky top-0">
						<tr className="bg-secondary text-primary/95">
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Product ID
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Name
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Price
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Total Stock
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Reserved
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Available
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Active
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-secondary/10">
						{stockLevels.map((row, index) => {
							return (
								<tr
									key={index}
									className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
								>
									<td className="px-4 py-3 text-sm font-medium text-secondary/90">
										{row.productId}
									</td>
									<td className="px-4 py-3 text-sm">{row.name}</td>
									<td className="px-4 py-3 text-sm">LKR. {row.price.toFixed(2)}</td>
									<td className="px-4 py-3 text-sm font-medium">{row.totalStock}</td>
									<td className="px-4 py-3 text-sm font-medium text-gold">
										{row.reservedStock}
									</td>
									<td
										className={
											"px-4 py-3 text-sm font-bold " +
											(row.availableStock > 0 ? "text-emerald-700" : "text-red-600")
										}
									>
										{row.availableStock}
									</td>
									<td className="px-4 py-3 text-sm">{row.isActive ? "Yes" : "No"}</td>
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
