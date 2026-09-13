import { useState } from "react";
import { BiShoppingBag } from "react-icons/bi";
import { LuListCollapse } from "react-icons/lu";
import { Link } from "react-router-dom";
import UserData from "./userData";

export default function Header() {
	const [sideBarOpen, setSideBarOpen] = useState(false);
	return (
		<header className="w-full h-[100px] bg-accent flex relative">
			<LuListCollapse
				onClick={() => {
					setSideBarOpen(true);
				}}
				className="text-white my-auto text-2xl ml-6 lg:hidden"
			/>
			<Link to="/" className="h-full flex items-center pl-6">
				<h1 className="text-primary text-2xl font-bold">TECHLOOM POS</h1>
			</Link>
			<div className="w-full h-full hidden lg:flex text-xl text-primary justify-center items-center gap-[30px]">
				<Link to="/">Home</Link>
				<Link to="/products">Products</Link>
				<Link to="/stock">Live Stock</Link>
				<Link to="/orders">My Orders</Link>
			</div>

			<div className="absolute right-24 top-0 h-full items-center hidden lg:flex">
				<UserData />
			</div>

			<Link
				to="/cart"
				className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-2xl"
			>
				<BiShoppingBag />
			</Link>

			{sideBarOpen && (
				<div className="fixed lg:hidden w-[100vw] h-screen top-0 left-0 bg-black/50 z-20 transition-all duration-300">
					<div className="w-[250px] h-screen flex-col relative">
						<div className="absolute w-full h-full bg-white left-[-250px] transform-flat translate-x-[250px] transition-transform duration-1000 flex flex-col">
							<div className="w-full h-[100px] bg-accent flex justify-center items-center">
								<h1 className="text-primary text-xl font-bold">TECHLOOM POS</h1>
								<LuListCollapse
									onClick={() => {
										setSideBarOpen(false);
									}}
									className="text-white my-auto text-2xl ml-6 lg:hidden rotate-180"
								/>
							</div>
							<div className="w-full h-full flex flex-col text-xl text-secondary justify-start items-start gap-6 mt-10 pl-6">
								<a className="hover:text-secondary transition" href="/" onClick={() => setSideBarOpen(false)}>
									Home
								</a>
								<a className="hover:text-secondary transition" href="/products" onClick={() => setSideBarOpen(false)}>
									Products
								</a>
								<a className="hover:text-secondary transition" href="/stock" onClick={() => setSideBarOpen(false)}>
									Live Stock
								</a>
								<a className="hover:text-secondary transition" href="/orders" onClick={() => setSideBarOpen(false)}>
									My Orders
								</a>
								<div className="flex justify-center bg-accent p-2 rounded-full">
									<UserData />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
