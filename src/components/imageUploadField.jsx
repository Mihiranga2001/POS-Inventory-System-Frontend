import { useState } from "react";
import toast from "react-hot-toast";
import uploadImage from "../utils/uploadImage";

//file picker + live preview. uploads on demand and hands the public URL back
//to the parent form through the onUploaded callback.
export default function ImageUploadField(props) {
	const value = props.value;
	const onChange = props.onChange;

	const [file, setFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [errorText, setErrorText] = useState("");

	const previewUrl = file != null ? URL.createObjectURL(file) : value;

	function handleUpload() {
		if (file == null) {
			toast.error("Choose an image first");
			return;
		}

		setIsUploading(true);
		setErrorText("");

		uploadImage(file)
			.then((url) => {
				onChange(url);
				setFile(null);
				setIsUploading(false);
				toast.success("Image uploaded");
			})
			.catch((err) => {
				setIsUploading(false);
				//kept on screen, unlike a toast, so the real reason can be read and copied
				setErrorText(err.message);
				toast.error("Upload failed");
			});
	}

	return (
		<div className="w-full">
			<label>Product image</label>

			<div className="flex flex-col lg:flex-row gap-4 mt-2">
				<div className="w-[120px] h-[120px] rounded-2xl bg-primary border border-accent/30 overflow-hidden flex items-center justify-center shrink-0">
					{previewUrl ? (
						<img
							src={previewUrl}
							className="w-full h-full object-cover"
							onError={(e) => {
								e.target.src = "/default.jpg";
							}}
						/>
					) : (
						<span className="text-xs text-secondary/50 text-center px-2">no image yet</span>
					)}
				</div>

				<div className="w-full flex flex-col gap-2">
					<input
						type="file"
						accept="image/*"
						onChange={(e) => {
							setFile(e.target.files[0] || null);
						}}
						className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent file:text-white hover:file:bg-accent/80"
					/>

					<button
						type="button"
						disabled={isUploading || file == null}
						onClick={handleUpload}
						className="w-full lg:w-[200px] h-[40px] bg-accent text-white font-bold rounded-2xl border-2 border-accent hover:bg-transparent hover:text-accent transition disabled:opacity-40"
					>
						{isUploading ? "Uploading..." : "Upload to Supabase"}
					</button>

					<input
						type="text"
						value={value}
						placeholder="or paste an image URL"
						onChange={(e) => {
							onChange(e.target.value);
						}}
						className="w-full h-[40px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent border border-accent shadow-2xl px-[20px]"
					/>
					<p className="text-xs text-secondary/50">
						JPG, PNG or WEBP up to 5MB. Upload first, then save the product.
					</p>

					{errorText != "" && (
						<div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
							<span className="font-semibold">Upload failed:</span> {errorText}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
