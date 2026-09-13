import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { AiOutlineProduct } from "react-icons/ai";
import ImageUploadField from "../../components/imageUploadField";

export default function AdminAddProductPage() {
	const [productId, setProductId] = useState("");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState("");
	const [category, setCategory] = useState("electronics");
	const [stock, setStock] = useState(0);
	const [isActive, setIsActive] = useState(true);
	const navigate = useNavigate();

	async function addProduct() {
		const token = localStorage.getItem("token");
		if (token == null) {
			toast.error("You must be logged in as admin to add products.");
			navigate("/login");
			return;
		}

		if (name == "" || price <= 0) {
			toast.error("Please provide at least a name and a price.");
			return;
		}

		try {
			await axios.post(
				import.meta.env.VITE_BACKEND_URL + "/products/",
				{
					productId: productId == "" ? undefined : productId,
					name: name,
					description: description,
					price: Number(price),
					image: image == "" ? undefined : image,
					category: category,
					stock: Number(stock),
					isActive: isActive,
				},
				{
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			);

			toast.success("Product added successfully!");
			navigate("/admin/products");
		} catch (err) {
			toast.error(err.response?.data?.message || "Error adding product. Please try again.");
			console.log(err);
		}
	}

	return (
		<div className="w-full flex justify-center p-[50px]">
			<div className="bg-accent/50 rounded-2xl p-[40px] w-[800px] shadow-2xl overflow-y-visible">
				<h1 className="w-full text-xl text-black mb-[20px] flex justify-center items-center gap-[5px] text-center">
					<AiOutlineProduct /> Add New Product
				</h1>

				<div className="w-full bg-white p-[20px] flex flex-row flex-wrap justify-between rounded-xl shadow-2xl">
					<div className="my-[10px] w-[40%]">
						<label>Product ID</label>
						<input
							type="text"
							value={productId}
							onChange={(e) => {
								setProductId(e.target.value);
							}}
							className="w-full h-[40px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
						/>
						<p className="text-sm text-gray-500 w-full text-right">
							Leave empty to auto generate
						</p>
					</div>
					<div className="my-[10px] w-[40%]">
						<label>Name</label>
						<input
							type="text"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
							}}
							className="w-full h-[40px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
						/>
					</div>
					<div className="my-[10px] w-full">
						<label>Description</label>
						<textarea
							value={description}
							onChange={(e) => {
								setDescription(e.target.value);
							}}
							className="w-full h-[100px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px] py-[10px]"
						/>
					</div>
					<div className="my-[10px] w-[40%]">
						<label>Price</label>
						<input
							type="number"
							value={price}
							onChange={(e) => {
								setPrice(e.target.value);
							}}
							className="w-full h-[40px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
						/>
					</div>
					<div className="my-[10px] w-[40%]">
						<label>Stock</label>
						<input
							type="number"
							value={stock}
							onChange={(e) => {
								setStock(e.target.value);
							}}
							className="w-full h-[40px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
						/>
					</div>
					<div className="my-[10px] w-full">
						<ImageUploadField
							value={image}
							onChange={(url) => {
								setImage(url);
							}}
						/>
					</div>
					<div className="my-[10px] flex flex-col w-[40%]">
						<label>Category</label>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="w-full h-[40px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
						>
							<option value="electronics">Electronics</option>
							<option value="beverage">Beverage</option>
							<option value="kitchen">Kitchen</option>
							<option value="stationery">Stationery</option>
							<option value="general">General</option>
						</select>
					</div>
					<div className="my-[10px] flex flex-col w-[40%]">
						<label>Active</label>
						<select
							value={isActive}
							onChange={(e) => setIsActive(e.target.value == "true")}
							className="w-full h-[40px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
						>
							<option value={true}>Yes</option>
							<option value={false}>No</option>
						</select>
					</div>

					<Link
						to="/admin/products"
						className="w-[49%] h-[50px] bg-red-500 text-white font-bold rounded-2xl flex justify-center items-center hover:bg-red-700 border-[2px] mt-[20px]"
					>
						Cancel
					</Link>
					<button
						onClick={addProduct}
						className="w-[49%] h-[50px] bg-accent text-white font-bold rounded-2xl hover:bg-transparent hover:text-accent border-[2px] border-accent mt-[20px]"
					>
						Add Product
					</button>
				</div>
			</div>
		</div>
	);
}
