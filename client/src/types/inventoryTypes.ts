export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory?: string | Category;
  status: "active" | "inactive";
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  parentCategory?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string | Category;
  brand: string;
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  isFeatured: boolean;
  averageRating: number;
  numReviews: number;
  status: "active" | "inactive";
}
