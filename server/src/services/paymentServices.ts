import crypto from "crypto";
import OrderModel from "../models/orderModel";

export const generateEsewaSignature = (secretKey: string, totalAmount: number, transactionId: string, productCode: string) => {
    const data = `total_amount=${totalAmount},transaction_uuid=${transactionId},product_code=${productCode}`;
    
    return crypto
        .createHmac("sha256", secretKey)
        .update(data)
        .digest("base64");
};
export const verifyPaymentAndCompleteOrder = async (orderId: string, paymentDetails: any) => {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new Error("Order not found");

    // Simulate the payment completion
    //In real scenario, you would verify the paymentDetails with eSewa's API before marking the order as paid.
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'Processing'; 
    
    return await order.save();
};