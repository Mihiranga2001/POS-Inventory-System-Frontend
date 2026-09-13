import { Link } from "react-router-dom";

export default function ProductCard(props) {
	const product = props.product;
	const available = product.stock - product.reservedStock;

	return (
		<div className="w-[300px] h-[420px] m-4 shadow-2xl cursor-pointer relative bg-white rounded-xl overflow-hidden hover:[&_.buttons]:opacity-100">
			<div className="w-full h-[220px] relative">
				<img
					src={product.image}
					className="w-full h-full absolute bg-white object-cover"
					onError={(e) => {
						e.target.src = "/default.jpg";
					}}
				/>
				{available <= 0 && (
					<span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
						Out of stock
					</span>
				)}
				{product.reservedStock > 0 && available > 0 && (
					<span className="absolute top-2 left-2 bg-gold text-white text-xs px-3 py-1 rounded-full">
						{product.reservedStock} reserved
					</span>
				)}
			</div>

			<div className="w-full h-[200px] p-2 flex flex-col justify-between">
				<h1 className="text-center text-lg">{product.name}</h1>
				<p className="text-center text-sm text-secondary/60">{product.category}</p>
				<div className="w-full flex flex-col items-center">
					<h2 className="text-accent font-semibold text-2xl">
						LKR. {product.price.toFixed(2)}
					</h2>
					<p className="text-sm mt-1">
						Available <span className="font-bold">{available}</span> / {product.stock}
					</p>
				</div>
			</div>

			<div className="w-full h-[200px] bottom-0 opacity-0 absolute buttons bg-white flex flex-row gap-4 justify-center items-center transition-opacity duration-300">
				<Link
					to={"/overview/" + product.productId}
					className="border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-150 h-[50px] w-[150px] flex justify-center items-center"
				>
					View Details
				</Link>
			</div>
		</div>
	);
}
