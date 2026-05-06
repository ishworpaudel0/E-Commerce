import { Request, Response, NextFunction } from "express";
import { generateEsewaSignature } from "../services/paymentServices";
import { successResponse } from "../utils/responseHandler";
import OrderModel from "../models/orderModel";
import * as paymentServices from "../services/paymentServices";

export const initiateEsewaPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);

    if (!order) throw new Error("Order not found");

    // Prepare data for eSewa signature
    const signature = generateEsewaSignature(
      process.env.ESEWA_SECRET_KEY!,
      order.totalPrice,
      order._id.toString(),
      process.env.ESEWA_PRODUCT_CODE!,
    );

    return successResponse(res, {
      message: "Payment signature generated",
      data: {
        signature,
        amount: order.totalPrice,
        transaction_uuid: order._id,
        product_code: process.env.ESEWA_PRODUCT_CODE,
        // These URLs tell eSewa where to send the user after payment
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        failure_url: `${process.env.FRONTEND_URL}/payment-failure`,
      },
    });
  } catch (error) {
    next(error);
  }
};
// New controller method to handle eSewa verification
export const verifyEsewaPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { data } = req.query;
    if (!data) throw new Error("No payment data received from eSewa");

    // Decode the eSewa response (
    const decodedString = Buffer.from(data as string, "base64").toString(
      "utf-8",
    );
    const decodedData = JSON.parse(decodedString);

    const { transaction_uuid, status } = decodedData;

    // In a mock project, checking 'COMPLETE' is sufficient to simulate success
    if (status !== "COMPLETE") {
      throw new Error("Payment was not completed");
    }

    //Update the database using service
    const order = await paymentServices.verifyPaymentAndCompleteOrder(
      transaction_uuid,
      decodedData,
    );

    return successResponse(res, {
      message: "Payment verified and order completed successfully!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
