import CartModel from "../models/cartModel";
import ProductModel from "../models/productModel";

export const addToCart = async (userId: string, productId: string, quantity: number = 1) => {
    //console.log(`ADD User: ${userId} | Product: ${productId} | Qty: ${quantity}`);

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
        //console.log("Creating new cart for user");
        cart = await CartModel.create({ 
            user: userId, 
            items: [], 
            totalPrice: 0 
        });
    }

    const product = await ProductModel.findById(productId);
    if (!product) throw new Error("Product not found");

    // Check if item already exists
    const existingIndex = cart.items.findIndex(
        (item: any) => item?.product?.toString() === productId
    );

    if (existingIndex !== -1) {
        // Safe update
        const itemToUpdate = cart.items[existingIndex];
        if (itemToUpdate) {
            itemToUpdate.quantity += quantity;
            //console.log("🔄Updated existing item quantity");
        }
    } else {
        cart.items.push({ 
            product: productId as any, 
            quantity 
        });
        //console.log("Added new item to cart");
    }

    // Recalculate total price safely
    cart.totalPrice = cart.items.reduce((total: number, item: any) => {
        return total + (product.price * (item?.quantity || 0));
    }, 0);

    await cart.save();
    //console.log(`Cart saved! Total items: ${cart.items.length}`);

    return await getCart(userId);
};

export const getCart = async (userId: string) => {
    console.log(`🔍 [GET] Fetching cart for user: ${userId}`);

    const cart = await CartModel.findOne({ user: userId })
        .populate('items.product', 'name price images');

    if (!cart) {
        //console.log("No cart found");
        return { items: [], totalPrice: 0 };
    }

    //console.log(`Cart retrieved with ${cart.items.length} items`);
    return cart;
};

export const removeItemFromCart = async (userId: string, productId: string) => {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) return { items: [], totalPrice: 0 };

    cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
    
    cart.totalPrice = 0; 
    await cart.save();

    return await getCart(userId);
};

export const clearCart = async (userId: string) => {
    await CartModel.findOneAndUpdate(
        { user: userId },
        { items: [], totalPrice: 0 }
    );
    return { items: [], totalPrice: 0 };
};