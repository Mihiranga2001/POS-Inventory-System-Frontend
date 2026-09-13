import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductDeleteButton(props) {
	const productId = props.productId;
	const reload = props.reload;
	const [isMessageOpen, setIsMessageOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);
		const token = localStorage.getItem("token");
		axios
			.delete(import.meta.env.VITE_BACKEND_URL + "/products/" + productId, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				if (response.data.softDeleted) {
					toast.success("Product has live reservations, it was deactivated instead");
				} else {
					toast.success("Product deleted successfully");
				}
				setIsDeleting(false);
				setIsMessageOpen(false);
				reload();
			})
			.catch(() => {
				toast.error("Failed to delete product");
				setIsDeleting(false);
			});
	}

	return (
		<>
			<button
				onClick={() => {
					setIsMessageOpen(true);
				}}
				className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
			>
				Delete
			</button>
			{isMessageOpen && (
				<div className="w-[100vw] h-screen fixed inset-0 z-[9999] top-0 left-0 bg-black/55 flex items-center justify-center">
					<div className="w-[600px] h-[300px] bg-primary rounded-2xl relative flex flex-col items-center justify-center p-10 shadow-xl">
						<button
							onClick={() => {
								setIsMessageOpen(false);
							}}
							className="w-[40px] h-[40px] bg-red-600 rounded-full text-white text-xl font-bold cursor-pointer hover:bg-red-800 absolute right-[-32px] top-[-32px]"
						>
							X
						</button>

						<h1 className="text-2xl text-center mb-6">
							Are you sure you want to delete product {productId}?
						</h1>
						<div className="w-full flex justify-center gap-10">
							<button
								disabled={isDeleting}
								onClick={handleDelete}
								className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
							>
								Delete
							</button>
							<button
								onClick={() => {
									setIsMessageOpen(false);
								}}
								className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
