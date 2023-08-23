const CartModel = require('../models/Cart');
const Product = require('../models/Products');

const getCart = async (req, res) => {
	try {
		const cart = await CartModel.findById(req.params.id).populate(
			'items.product'
		); // populate product info like name/descript

		if (!cart) {
			return res.status(400).json({ status: 'error', msg: 'no cart found' });
		}
		res.status(200).json(cart);
	} catch (error) {
		console.error('Error in controller:', error);
	}
};

const createEmptyCart = async (req, res) => {
	try {
		const newCart = new CartModel();
		await newCart.save(); //saving it to DB
		res.status(200).json({
			status: 'ok',
			cartId: newCart._id,
			msg: 'created empty cart!',
		});
	} catch (error) {
		res.status(400).json({ status: 'error', msg: 'error creating empty cart' });
	}
};

const addNewCart = async (req, res) => {
	try {
		const product = await Product.findById(req.body.productId);
		if (!product) {
			return res
				.status(400)
				.json({ status: 'error', msg: 'product not found!' });
		}

		const cart = await CartModel.findById(req.body.cartId);

		if (!cart) {
			return res.status(400).json({ status: 'error', msg: 'cart not found!' });
		}

		//managing quanities for cart

		//checking if item added to cart already exists in cart
		const findIndex = cart.items.findIndex(
			(item) => item.product.toString() === req.body.productId // item.product is essentially the objectID of a product
		);

		// if the product is in the cart, update its quantity
		if (findIndex > -1) {
			cart.items[findIndex].quantity += req.body.quantity;
			cart.totalAmount += product.price * req.body.quantity;

			//or else just add it into cart as a new item
		} else {
			const cartItem = {
				product: req.body.productId,
				price: product.price,
				quantity: req.body.quantity || 1,
			};
			cart.items.push(cartItem);
			cart.totalAmount += cartItem.price * cartItem.quantity;
		}
		await cart.save();

		res.status(200).json({
			status: 'ok',
			msg: 'item added to cart!',
			cart: cart,
		});
	} catch (error) {
		console.log(error);
		res
			.status(500)
			.json({ status: 'error', msg: 'unable to add item to cart' });
	}
};

const deleteItemFromCart = async (req, res) => {
	try {
		const cartId = req.body.cartId;
		const productId = req.body.productId;
		const cart = await CartModel.findById(cartId);

		if (!cart) {
			return res.status(400).json({ status: 'error', msg: 'no cart found!' });
		}

		// find if item already exists in cart
		const findIndex = cart.items.findIndex(
			(item) => item.product.toString() === productId
		);

		console.log(
			'Cart product IDs:',
			cart.items.map((item) => item.product.toString())
		);

		if (findIndex === -1) {
			return res
				.status(404)
				.json({ status: 'error', msg: 'Product not found in cart!' });
		}

		let updatedCart;

		// If the item's quantity is more than 1, decrement it
		if (cart.items[findIndex].quantity > 1) {
			cart.items[findIndex].quantity -= 1;
			cart.totalAmount -= cart.items[findIndex].price;

			updatedCart = await cart.save();
		} else {
			// If the item's quantity is 1, remove the product from the cart
			updatedCart = await CartModel.findByIdAndUpdate(
				cartId,
				{
					$pull: { items: { product: productId } },
					$inc: { totalAmount: -cart.items[findIndex].price },
				},
				{ new: true }
			); // The option { new: true } returns the updated document
		}

		res.status(200).json({
			status: 'ok',
			msg: 'Updated cart successfully!',
			cart: updatedCart,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ status: 'error', msg: 'error updating cart' });
	}
};

const updateCartItem = async (req, res) => {
	try {
		const productId = req.body.productId;
		const newQuantity = req.body.quantity;
		const cartId = req.body.cartId;

		const cart = await CartModel.findById(cartId);

		if (!cart) {
			return res.status(404).json({ status: 'error', msg: 'no cart found!' });
		}

		// find the item index
		const findIndex = cart.items.findIndex(
			(item) => item.product.toString() === productId
		);

		if (findIndex === -1) {
			return res
				.status(404)
				.json({ status: 'error', msg: 'Product not found in cart!' });
		}

		// update the totalAmount to subtract the old product amount and add the new product amount
		cart.totalAmount -=
			cart.items[findIndex].price * cart.items[findIndex].quantity;

		cart.items[findIndex].quantity = newQuantity;

		cart.totalAmount += cart.items[findIndex].price * newQuantity;

		await cart.save();

		res.status(200).json({
			status: 'ok',
			msg: 'cart item updated!',
			cart: cart,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ status: 'error', msg: 'error updating cart item' });
	}
};

const clearCart = async (req, res) => {
	try {
		const cartId = req.params.cartId;
		console.log(cartId);
		const cart = await CartModel.findById(cartId);

		if (!cart) {
			return res.status(404).json({ status: 'error', msg: 'no cart found!' });
		}

		//initialising cart to original empty state
		cart.items = [];
		cart.totalAmount = 0;

		await cart.save();

		res.status(200).json({
			status: 'ok',
			msg: 'All items removed from cart!',
			cart: cart,
		});
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ status: 'error', msg: 'error clearing cart' });
	}
};

module.exports = {
	getCart,
	addNewCart,
	deleteItemFromCart,
	updateCartItem,
	createEmptyCart,
	clearCart,
};
