export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
  createdAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Glass' | 'Steel' | 'Plastic' | 'Other';
  stockQuantity: number;
  productImage: string;
  productImages?: string[];
  brand: string;
  capacity: string;
  material: 'Glass' | 'Steel' | 'Plastic';
  availabilityStatus: 'In Stock' | 'Out of Stock';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  productImage: string;
}

export interface Order {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  orderStatus: 'Pending' | 'Processing' | 'Delivered';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
