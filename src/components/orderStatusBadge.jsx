export default function OrderStatusBadge(props) {
	const status = props.status;

	function getStatusBadgeClasses(status) {
		switch (status) {
			case "PAID":
				return "bg-emerald-100 text-emerald-800 border border-emerald-200";
			case "RESERVED":
				return "bg-blue-100 text-blue-800 border border-blue-200";
			case "PROCESSING":
				return "bg-indigo-100 text-indigo-800 border border-indigo-200";
			case "FAILED":
				return "bg-red-100 text-red-800 border border-red-200";
			case "CANCELLED":
				return "bg-gray-200 text-gray-800 border border-gray-300";
			case "EXPIRED":
				return "bg-orange-100 text-orange-800 border border-orange-200";
			default:
				//PENDING
				return "bg-yellow-100 text-yellow-800 border border-yellow-200";
		}
	}

	return (
		<span
			className={
				"px-3 py-1 rounded-full text-xs font-semibold tracking-wide " +
				getStatusBadgeClasses(status)
			}
		>
			{status}
		</span>
	);
}
