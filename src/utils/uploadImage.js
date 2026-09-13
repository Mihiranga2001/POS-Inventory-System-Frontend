import axios from "axios";

//sends the file to our own API, which forwards it to Supabase using the secret
//service key. the key never reaches the browser.
export default function uploadImage(file) {
	return new Promise((resolve, reject) => {
		if (file == null) {
			reject(new Error("No file selected"));
			return;
		}

		if (!file.type.startsWith("image/")) {
			reject(new Error("Only image files are allowed"));
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			reject(new Error("Image must be smaller than 5MB"));
			return;
		}

		const token = localStorage.getItem("token");
		const formData = new FormData();
		formData.append("file", file);

		axios
			.post(import.meta.env.VITE_BACKEND_URL + "/upload", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					//Content-Type is left to the browser so it can add the multipart boundary
				},
			})
			.then((response) => {
				resolve(response.data.url);
			})
			.catch((err) => {
				reject(new Error(err.response?.data?.message || "Image upload failed"));
			});
	});
}
