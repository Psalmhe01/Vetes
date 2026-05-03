//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)
export type ApiResponse<T> = {
  data: T;
  errors: ApiError[];
  hasErrors: boolean;
};

export type ApiError = {
  property: string;
  message: string;
};

export type AnyObject = {
  [index: string]: any;
};

export type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
};

export type ProductSizeMeasurementForSizeGetDto = {
  id: number;
  measurementTypeName: string;
  measurementTypeUnit: string;
  value: number;
};

export type ProductSizeForProductGetDto = {
  id: number;
  stock: number;
  sizeId: number;
  sizeName: string;
  measurements: ProductSizeMeasurementForSizeGetDto[];
};

export type ProductSizeGetDto = {
  id: number;
  stock: number;
  sizeId: number;
  productId: number;
  sizeName: number;
  productName: string;
  productPrice: number;
};

export type ProductGetDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  sizes: ProductSizeForProductGetDto[];
};

export type ProductCreateDto = {
  name: string;
  description: string;
  price: number;
  categoryId: number;
};


export type SizeGetDto = {
  id: number;
  name: string;
};

export type ProductSizeCreateDto = {
  stock: number;
};

export type ProductSizeMeasurementCreateDto = {
  measurementTypeId: number;
  value: number;
};

export type MeasurementTypeGetDto = {
  id: number;
  name: string;
  unit: string;
};

export type CategoryGetDto = {
  id: number;
  name: string;
  products: ProductGetDto[];
};

export type CartProductGetDto = {
  id: number;
  productSizeId: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
};

export type CartProductCreateDto = {
  productSizeId: number;
  sizeId: number;
  quantity: number;
};

export type CategoryCreateUpdateDto = {
  name: string;
}

export type UserCreateUpdateDto = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmpass: string;
  email: string;
  phone: string;
};

export type CartGetDto = {
  id: number;
  userId: number;
  updatedAt: string;
  products: CartProductGetDto[];
};

export type CartCreateDto = {
  userId: number;
  updatedAt: Date;
};

export type CartProductCreateUpdateDto = {
  cartId: number;
  productSizeId: number;
  quantity: number;
};

export type OrdersGetDto = {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  shippingAddressId: number;
};