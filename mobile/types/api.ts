export interface Product {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  image: string | null;
  price: number;
}

export interface User {
  id: number;
  name: string | null;
  email: string;
  password: string;
  role: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
}
