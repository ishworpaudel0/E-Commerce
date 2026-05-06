import OrderModel from "../models/orderModel";

export const getDashboardStats = async () => {
    const orders = await OrderModel.find({ 
        isPaid: true,
        status:'Delivered'
    });

    // Calculate total revenue from all paid orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    return {
        totalOrders: await OrderModel.countDocuments({ status: { $ne: 'Cancelled' } }),
        totalRevenue,
        pendingOrdersCount: await OrderModel.countDocuments({ status: 'Pending' }),
        shippedOrdersCount: await OrderModel.countDocuments({ status: 'Shipped' })
    };
};

export const getAllOrdersForAdmin = async () => {
    // Admins need to see everything, sorted by newest first
    return await OrderModel.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
};