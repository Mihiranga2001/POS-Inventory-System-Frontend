import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Home from "./homeContent";
import ProductPage from "./productPage";
import ProductOverview from "./productOverview";
import StockPage from "./stockPage";
import CartPage from "./cart";
import CheckoutPage from "./checkOut";
import PaymentPage from "./paymentPage";
import OrdersPage from "./ordersPage";

export default function HomePage() {
	return (
		<div className="w-full h-full overflow-y-scroll max-h-full">
			<Header />
			<div className="w-full min-h-[calc(100%-100px)]">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/products" element={<ProductPage />} />
					<Route path="/overview/:productId" element={<ProductOverview />} />
					<Route path="/stock" element={<StockPage />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/checkout" element={<CheckoutPage />} />
					<Route path="/payment/:orderId" element={<PaymentPage />} />
					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/*" element={<h1 className="p-10 text-2xl">page not found</h1>} />
				</Routes>
			</div>
			<Footer />
		</div>
	);
}
