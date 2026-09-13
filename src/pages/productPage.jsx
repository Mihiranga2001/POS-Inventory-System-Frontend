import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/loader";
import ProductCard from "../components/productCard";

export default function ProductPage() {
	const [products, setProducts] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");
	const [inStockOnly, setInStockOnly] = useState(false);

	function loadProducts() {
		let query = "?limit=100";

		if (search != "") {
			query = query + "&search=" + search;
		}
		if (category != "") {
			query = query + "&category=" + category;
		}
		if (inStockOnly) {
			query = query + "&inStock=true";
		}

		axios
			.get(import.meta.env.VITE_BACKEND_URL + "/products" + query)
			.then((response) => {
				//the backend replies with { products: [...] }, but stay safe if a
				//plain array comes back so the page can never crash on .map()
				const data = response.data;
				const list = Array.isArray(data) ? data : data?.products;

				setProducts(Array.isArray(list) ? list : []);
				setLoaded(true);
			})
			.catch((err) => {
				console.log("Failed to load products:");
				console.log(err);
				toast.error("Failed to load products. Check VITE_BACKEND_URL.");
				setProducts([]);
				setLoaded(true);
			});
	}

	useEffect(() => {
		loadProducts();
	}, [search, category, inStockOnly]);

	return (
		<div className="w-full">
			{!loaded ? (
				<Loader />
			) : (
				<div className="w-full flex justify-center p-4 flex-row flex-wrap">
					<div className="w-full h-[100px] sticky top-0 bg-white flex justify-center items-center gap-4 mb-4 shadow-md z-10">
						<input
							type="text"
							placeholder="Search products..."
							value={search}
							className="w-1/3 px-4 py-2 border border-secondary/30 rounded-lg outline-none focus:ring-2 focus:ring-accent"
							onChange={(e) => {
								setSearch(e.target.value);
							}}
						/>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="px-4 py-2 border border-secondary/30 rounded-lg outline-none focus:ring-2 focus:ring-accent"
						>
							<option value="">All categories</option>
							<option value="electronics">Electronics</option>
							<option value="beverage">Beverage</option>
							<option value="kitchen">Kitchen</option>
							<option value="stationery">Stationery</option>
							<option value="general">General</option>
						</select>
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={inStockOnly}
								onChange={(e) => setInStockOnly(e.target.checked)}
							/>
							In stock only
						</label>
					</div>

					{products.length == 0 && (
						<p className="w-full text-center text-secondary/60 py-10">
							No products matched your search.
						</p>
					)}

					{products.map((item) => {
						return <ProductCard key={item.productId} product={item} />;
					})}
				</div>
			)}
		</div>
	);
}
