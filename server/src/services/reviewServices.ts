import ReviewModel from "../models/reviewModel";
import ProductModel from "../models/productModel";

export const addReview = async (
  userId: string,
  productId: string,
  reviewData: any,
) => {
  const review = await ReviewModel.create({
    user: userId,
    product: productId,
    ...reviewData,
  });

  //Recalculate Average Rating for the Product
  const stats = await ReviewModel.aggregate([
    { $match: { product: review.product } },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  //Update Product Model with new stats so that we can show average rating in product.
  if (stats.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      numReviews: stats[0].nRating,
      averageRating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
    });
  }

  return review;
};

export const getReviewsForProduct = async (productId: string) => {
  return await ReviewModel.find({ product: productId })
    .populate("user", "name email") // Populate user details (name and email)
    .sort({ createdAt: -1 }); // Sort by newest first
};
