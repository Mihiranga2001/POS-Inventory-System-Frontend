import { useEffect, useState } from "react";

//counts down the 5 minute stock reservation window
export default function CountDown(props) {
	const expiresAt = props.expiresAt;
	const onExpire = props.onExpire;

	function getRemaining() {
		if (expiresAt == null) {
			return 0;
		}
		return Math.max(Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000), 0);
	}

	const [seconds, setSeconds] = useState(getRemaining());

	useEffect(() => {
		setSeconds(getRemaining());

		const interval = setInterval(() => {
			const remaining = getRemaining();
			setSeconds(remaining);

			if (remaining <= 0) {
				clearInterval(interval);
				if (onExpire != null) {
					onExpire();
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [expiresAt]);

	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;

	return (
		<span
			className={
				"font-mono text-2xl font-bold " +
				(seconds <= 60 ? "text-red-600 animate-pulse" : "text-accent")
			}
		>
			{String(minutes).padStart(2, "0")}:{String(rest).padStart(2, "0")}
		</span>
	);
}
