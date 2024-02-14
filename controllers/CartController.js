// controllers/CartController.js

const User = require('../models/User');
const Product = require('../models/Product');

const CartController = {
    // Display the user's cart
    showCart: async (req, res) => {
        try {
            const user = req.user; // Assuming you're using Passport for authentication
            res.render('./user/cart', { cart: user.cart });
        } catch (error) {
            console.error('Error displaying cart:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Add a product to the cart
    // Add a product to the cart
    // addToCart: (req, res) => {
    //     const productId = req.params.productId;
    //     console.log(productId);
    //     const user = req.user; // Assuming you're using Passport for authentication

    //     Product.findById(productId)
    //       .then((product) => {
    //         if (!product) {
    //           return res.status(404).json({ message: 'Product not found' });
    //         }

    //         const existingCartItemIndex = user.cart.findIndex(item => item.productId.equals(product._id));

    //         if (existingCartItemIndex !== -1) {
    //           // If the product is already in the cart, increment the quantity
    //           user.cart[existingCartItemIndex].quantity += 1;
    //         } else {
    //           // If the product is not in the cart, add it with a quantity of 1
    //           user.cart.push({ productId: product._id, quantity: 1 });
    //         }

    //         return user.save();
    //       })
    //       .then(() => {
    //         res.json({ message: 'Item added to cart successfully' });
    //       })
    //       .catch((error) => {
    //         console.error('Error adding item to cart:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //       });
    //   },


    // Add a product to the cart
    addToCart: (req, res) => {
        const productId = req.params.productId;
        const user = req.user; // Assuming you're using Passport for authentication

        Product.findById(productId)
            .then((product) => {
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }

                const existingCartItem = user.cart.items.find(item => item.productId.equals(product._id));

                if (existingCartItem) {
                    // If the product is already in the cart, increment the quantity
                    existingCartItem.quantity += 1;
                } else {
                    // If the product is not in the cart, add it with a quantity of 1
                    user.cart.items.push({ productId: product._id, quantity: 1 });
                }

                return user.save();
            })
            .then(() => {
                // res.json({ message: 'Item added to cart successfully' });
                console.log('Item added to cart successfully');
                res.redirect('/cart');
            })
            .catch((error) => {
                console.error('Error adding item to cart:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },



    // Remove a product from the cart
    //   removeFromCart: async (req, res) => {
    //     try {
    //       const productId = req.params.productId;
    //       const user = req.user; // Assuming you're using Passport for authentication

    //       // Remove the product from the user's cart
    //       user.cart = user.cart.filter(item => !item.product.equals(productId));

    //       // Save the updated user document
    //       await user.save();

    //       res.json({ message: 'Item removed from cart successfully' });
    //     } catch (error) {
    //       console.error('Error removing item from cart:', error);
    //       res.status(500).json({ error: 'Internal Server Error' });
    //     }
    //   },
    removeFromCart: (req, res) => {
        const productId = req.params.productId;
        const quantityToRemove = parseInt(req.body.quantity, 10) || 1;

        User.findOne({ _id: req.user._id })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                if (user.cart.items) { // Check if user.cart is an object with 'items'
                    const cartItemIndex = user.cart.items.findIndex(item => item.productId.equals(productId));

                    if (cartItemIndex !== -1) {
                        if (user.cart.items[cartItemIndex].quantity > quantityToRemove) {
                            user.cart.items[cartItemIndex].quantity -= quantityToRemove;
                        } else {
                            user.cart.items.splice(cartItemIndex, 1);
                        }
                    } else {
                        return Promise.reject({ status: 404, message: 'Product not found in the cart' });
                    }
                } else {
                    return Promise.reject({ status: 500, message: 'Invalid cart structure' });
                }

                return user.save();
            })
            .then(() => {
                res.redirect('/cart');
                console.log('Item removed from cart successfully');
            })
            .catch(error => {
                console.error('Error removing item from cart:', error);
                const status = error.status || 500;
                res.status(status).json({ error: error.message || 'Internal Server Error' });
            });
    },

    //   removeFromCart: (req, res) => {
    //     const productId = req.params.productId;
    //     const quantityToRemove = parseInt(req.body.quantity, 10) || 1;

    //     User.findOne({ _id: req.user._id })
    //       .then(user => {
    //         if (!user) {
    //           return res.status(404).json({ message: 'User not found' });
    //         }

    //         const cartItemIndex = user.cart.items.findIndex(item => item.productId.equals(productId));

    //         if (cartItemIndex !== -1) {
    //           if (user.cart.items[cartItemIndex].quantity > quantityToRemove) {
    //             user.cart.items[cartItemIndex].quantity -= quantityToRemove;
    //           } else {
    //             user.cart.items.splice(cartItemIndex, 1);
    //           }

    //           return user.save();
    //         } else {
    //           return Promise.reject({ status: 404, message: 'Product not found in the cart' });
    //         }
    //       })
    //       .then(() => {
    //         res.redirect('/cart');
    //       })
    //       .catch(error => {
    //         console.error('Error removing item from cart:', error);
    //         const status = error.status || 500;
    //         res.status(status).json({ error: error.message || 'Internal Server Error' });
    //       });
    //   },
    // };

    placeOrder: (req, res) => {
        const user = req.user; // Assuming you're using Passport for authentication

        // Implement your logic for placing the order, for example, updating order status, creating an order record, etc.
        // ...

        // Clear the user's cart after placing the order
        user.cart.items = [];

        user.save()
            .then(() => {
                res.redirect('/orders'); // Redirect to the orders page or any other page after placing the order
            })
            .catch(error => {
                console.error('Error placing order:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    },

};

module.exports = CartController;
