import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import ProductDeleteButton from "../../components/productDeleteButton";

export default function AdminProductsPage() {
	const [products, setProducts] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		if (!loaded) {
			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/products?limit=100")
				.then((response) => {
					setProducts(response.data.products);
					setLoaded(true);
				})
				.catch(() => {
					setLoaded(true);
				});
		}
	}, [loaded]);

	function restock(productId, adjustment) {
		const token = localStorage.getItem("token");

		axios
			.patch(
				import.meta.env.VITE_BACKEND_URL + "/products/" + productId + "/stock",
				{ adjustment: adjustment },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(() => {
				toast.success("Stock adjusted");
				setLoaded(false);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "Failed to adjust stock");
			});
	}

	return (
		<div className="w-full flex justify-center p-10 relative bg-gradient-to-b from-primary to-white text-secondary">
			{loaded ? (
				<table className="w-full max-w-7xl table-auto border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-xl bg-white/70">
					<thead className="sticky top-0 z-10">
						<tr className="bg-secondary text-primary/95">
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Image
							</th>
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
								Category
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Stock
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
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-secondary/10">
						{products.map((item, index) => {
							return (
								<tr
									key={index}
									className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
								>
									<td className="px-4 py-3 align-middle">
										<img
											src={item.image}
											className="w-[38px] h-[38px] rounded-lg object-cover ring-1 ring-secondary/10 shadow-sm"
											onError={(e) => {
												e.target.src = "/default.jpg";
											}}
										/>
									</td>
									<td className="px-4 py-3 text-sm font-medium text-secondary/90">
										{item.productId}
									</td>
									<td className="px-4 py-3 text-sm">{item.name}</td>
									<td className="px-4 py-3 text-sm font-semibold text-secondary">
										{item.price.toFixed(2)}
									</td>
									<td className="px-4 py-3 text-sm">{item.category}</td>
									<td className="px-4 py-3 text-sm font-medium">{item.stock}</td>
									<td className="px-4 py-3 text-sm font-medium text-gold">
										{item.reservedStock}
									</td>
									<td className="px-4 py-3 text-sm font-bold">
										{item.stock - item.reservedStock}
									</td>
									<td className="px-4 py-3 text-sm text-center">
										{item.isActive ? "Yes" : "No"}
									</td>
									<td className="px-4 py-3 text-sm">
										<div className="inline-flex items-center gap-2">
											<button
												onClick={() => restock(item.productId, 10)}
												className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
											>
												+10
											</button>
											<button
												onClick={() => {
													navigate("/admin/update-product", { state: item });
												}}
												className="px-3 py-2 rounded-md w-[70px] text-center bg-accent/20 text-accent hover:bg-accent/30 transition"
											>
												Edit
											</button>
											<ProductDeleteButton
												productId={item.productId}
												reload={() => {
													setLoaded(false);
												}}
											/>
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

			<Link
				to="/admin/add-product"
				className="fixed right-[20px] bottom-[20px] w-[56px] h-[56px]
        flex justify-center items-center text-4xl rounded-full
        bg-accent text-primary shadow-2xl ring-2 ring-accent/30
        hover:scale-105 active:scale-95 transition-all"
			>
				<BiPlus />
			</Link>
		</div>
	);
}
