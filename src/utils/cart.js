import toast from "react-hot-toast";

export function getCart() {
	const cartString = localStorage.getItem("cart");

	if (cartString == null) {
		localStorage.setItem("cart", "[]");
		return [];
	} else {
		const cart = JSON.parse(cartString);
		return cart;
	}
}

export function addToCart(product, quantity) {
	const cart = getCart();

	//check if product is already in cart
	const index = cart.findIndex((item) => {
		return item.productId == product.productId;
	});

	if (index == -1) {
		cart.push({
			productId: product.productId,
			name: product.name,
			price: product.price,
			quantity: quantity,
			image: product.image,
		});
		toast.success(`${product.name} added to cart`);
	} else {
		const newQty = cart[index].quantity + quantity;

		if (newQty <= 0) {
			cart.splice(index, 1);
			toast.success(`${product.name} removed from cart`);
		} else {
			cart[index].quantity = newQty;
			toast.success(`Updated ${product.name} quantity to ${newQty}`);
		}
	}

	const cartString = JSON.stringify(cart);
	localStorage.setItem("cart", cartString);
}

export function removeFromCart(productId) {
	const cart = getCart();
	const newCart = cart.filter((item) => {
		return item.productId != productId;
	});
	localStorage.setItem("cart", JSON.stringify(newCart));
}

export function emptyCart() {
	localStorage.setItem("cart", "[]");
}

export function getCartTotal() {
	let total = 0;
	const cart = getCart();

	cart.forEach((item) => {
		total += item.price * item.quantity;
	});
	return total;
}

//every checkout / payment request carries one of these so the backend can
//detect and reject duplicate submissions
export function createIdempotencyKey(prefix) {
	return prefix + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}
