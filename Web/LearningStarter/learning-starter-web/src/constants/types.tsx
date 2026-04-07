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

export type ProductGetDto = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  sizes: ProductSizeForProductGetDto[];
};

export type CategoryGetDto = {
  id: number;
  name: string;
  products: ProductGetDto[];
};

export type CartGetDto = {
  id: number;
  userid: number;
  products: ProductGetDto[];
};



export type UserCreateUpdateDto = {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmpass: string;
  email: string;
  phone: string;

};
