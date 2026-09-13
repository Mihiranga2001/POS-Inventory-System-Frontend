import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!loaded) {
			const token = localStorage.getItem("token");

			axios
				.get(import.meta.env.VITE_BACKEND_URL + "/users/all", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setUsers(Array.isArray(response.data) ? response.data : []);
					setLoaded(true);
				})
				.catch(() => {
					setLoaded(true);
				});
		}
	}, [loaded]);

	function toggleBlock(email, isBlocked) {
		const token = localStorage.getItem("token");

		axios
			.put(
				import.meta.env.VITE_BACKEND_URL + "/users/toggle-block/" + email,
				{ isBlocked: !isBlocked },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(() => {
				toast.success("User status updated");
				setLoaded(false);
			})
			.catch((err) => {
				toast.error(err.response?.data?.message || "Failed to update user");
			});
	}

	return (
		<div className="w-full flex justify-center p-10 relative bg-gradient-to-b from-primary to-white text-secondary">
			{loaded ? (
				<table className="w-full max-w-7xl table-auto border-separate border-spacing-0 rounded-2xl overflow-hidden shadow-xl bg-white/70">
					<thead className="sticky top-0">
						<tr className="bg-secondary text-primary/95">
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Image
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Email
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Name
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Role
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Blocked
							</th>
							<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-secondary/10">
						{users.map((user, index) => {
							return (
								<tr
									key={index}
									className="odd:bg-primary/60 even:bg-white hover:bg-primary/90 transition-colors"
								>
									<td className="px-4 py-3">
										<img
											src={user.image}
											referrerPolicy="no-referrer"
											className="w-[38px] h-[38px] rounded-full object-cover"
											onError={(e) => {
												e.target.src = "/default.jpg";
											}}
										/>
									</td>
									<td className="px-4 py-3 text-sm">{user.email}</td>
									<td className="px-4 py-3 text-sm">
										{user.firstName} {user.lastName}
									</td>
									<td className="px-4 py-3 text-sm">{user.role}</td>
									<td className="px-4 py-3 text-sm">{user.isBlocked ? "Yes" : "No"}</td>
									<td className="px-4 py-3 text-sm">
										<button
											onClick={() => toggleBlock(user.email, user.isBlocked)}
											className={
												"px-3 py-2 rounded-md text-white transition " +
												(user.isBlocked
													? "bg-emerald-600 hover:bg-emerald-700"
													: "bg-red-500 hover:bg-red-600")
											}
										>
											{user.isBlocked ? "Unblock" : "Block"}
										</button>
									</td>
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
