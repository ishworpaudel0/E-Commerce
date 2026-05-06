import OrderModel from "../models/orderModel";
import CartModel from "../models/cartModel";
import ProductModel from "../models/productModel";

export const createOrder = async (userId: string, shippingData: any) => {
    //Get User's Cart
    //console.log(`ORDER CREATE For user: ${userId}`);
    const cart = await CartModel.findOne({ user: userId }).populate('items.product');
    //console.log(`Found cart with ${cart?.items?.length || 0} items`);
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    //Prepare Order Items & Update Stock
    const orderItems = [];
    for (const item of cart.items) {
        const product = item.product as any;

        // Decrease stock in DB
        if (product.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name}`);
        }
        product.stock -= item.quantity;
        await product.save();

        orderItems.push({
            product: product._id,
            name: product.name,
            quantity: item.quantity,
            price: product.price, // Snapshot of current price
            image: product.images[0]
        });
    }

    //Create Order
    const order = await OrderModel.create({
        user: userId,
        orderItems,
        shippingAddress: shippingData,
        totalPrice: cart.totalPrice,
        paymentMethod: shippingData.paymentMethod || 'COD'
    });

    //Clear Cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return order;
};


export const cancelOrder = async (orderId: string, userId: string, isAdmin: boolean) => {
    const order = await OrderModel.findById(orderId);
    
    if (!order) throw new Error("Order not found");

    //Only the owner or an admin can cancel
    if (order.user.toString() !== userId && !isAdmin) {
        throw new Error("Not authorized to cancel this order");
    }

    // Only "Pending" or "Processing" orders should be cancellable
    if (order.status !== 'Pending' && order.status !== 'Processing') {
        throw new Error("Order cannot be cancelled at this stage");
    }

    //Restore Stock
    for (const item of order.orderItems) {
        await ProductModel.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity } // Increment stock back
        });
    }

    //Update Status
    order.status = 'Cancelled';
    return await order.save();
};
export const getMyOrders = async (userId: string) => {
    return await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId: string) => {
    return await OrderModel.findById(orderId).populate('user', 'name email');
};

// Update Order Status (Admin Only)
export const updateOrderStatus = async (orderId: string, status: string) => {
    const order = await OrderModel.findByIdAndUpdate(
        orderId, 
        { status }, 
        { new: true }
    );
    if (!order) throw new Error("Order not found");
    return order;
};
export const getAllOrders = async () => {
    return await OrderModel.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
};
