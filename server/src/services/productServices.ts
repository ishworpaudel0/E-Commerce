import slugify from "slugify";
import ProductModel from "../models/productModel";
import { IProduct } from "../interfaces/productInterface";
import CategoryModel from "../models/categoryModel";

export const createProduct = async (
  productData: Partial<IProduct>,
): Promise<IProduct> => {
  if (productData.name) {
    productData.slug = slugify(productData.name, { lower: true, strict: true });
  }
  const categoryExists = await CategoryModel.findById(productData.category);
  if (!categoryExists) {
    throw new Error("The specified category for this product does not exist.");
  }
  const product = new ProductModel(productData); //save to database
  return await product.save();
};

export const getAllProducts = async (queryParams: any) => {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sort,
    page = 1,
    limit = 10,
  } = queryParams;
  let query: any = {};

  //Filtering Logic
  if (category) query.category = category; // This lgic looks for exact category match.
  //Case sensetive Eg. if searched for apple it looks for Apple, APPLE
  if (brand) query.brand = { $regex: brand, $options: "i" }; 
  //gte=greather than or equal to
  //lte=less than or equal to
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  // or used to search for either name or description.
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  //Pagination Logic
  const pageNumber = Math.abs(parseInt(page)) || 1;
  const limitNumber = Math.abs(parseInt(limit)) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  //Here skip helps to skip for data. Eg. if in page 2 and limit is 10, it skips 10 item and shows 11-20.

  //Sorting Logic
  let sortOrder: any = { createdAt: -1 };
  if (sort === "price_asc") sortOrder = { price: 1 };
  if (sort === "price_desc") sortOrder = { price: -1 };

  const products = await ProductModel.find(query)
    .populate("category", "name")
    .sort(sortOrder)
    .skip(skip)
    .limit(limitNumber);

  //Total Count (Essential for frontend pagination bars)
  const totalProducts = await ProductModel.countDocuments(query);

  return {
    products,
    meta: {
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      limit: limitNumber,
    },
  };
};

export const updateProduct = async (
  id: string,
  updateData: Partial<IProduct>,
) => {
  if (updateData.name) {
    updateData.slug = slugify(updateData.name, { lower: true, strict: true });
  }

  // Validate category exists if it's being changed
  if (updateData.category) {
    const categoryExists = await CategoryModel.findById(updateData.category);
    if (!categoryExists) {
      throw new Error("The specified category does not exist.");
    }
  }

  return await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("category", "name");
};


//to get detail page of each product
export const getProductBySlug = async (slug: string) => {
  return await ProductModel.findOne({ slug }).populate("category", "name");
};
