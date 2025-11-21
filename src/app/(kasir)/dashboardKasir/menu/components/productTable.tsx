import { useState } from "react";
import ProductRow from "./productRow";

type Product = {
  id: number
  name: string
  stock: number
  status: string
  category: string
  price: number
  image: string
}

const initialProducts: Product[] = [
    {
      id: 1,
      name: 'Chicken Parmesan',
      stock: 10,
      status: 'Aktif',
      category: 'Chicken',
      price: 55.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 2,
      name: 'Beef Burger',
      stock: 8,
      status: 'Aktif',
      category: 'Beef',
      price: 45.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 3,
      name: 'Fried Rice',
      stock: 15,
      status: 'Aktif',
      category: 'Rice',
      price: 30.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 4,
      name: 'Spaghetti Carbonara',
      stock: 5,
      status: 'Aktif',
      category: 'Pasta',
      price: 50.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 5,
      name: 'Chicken Curry',
      stock: 12,
      status: 'Aktif',
      category: 'Chicken',
      price: 60.0,
      image: '/images/chicken_parmesan.jpg',
    },
    {
      id: 6,
      name: 'Vegetable Salad',
      stock: 20,
      status: 'Aktif',
      category: 'Veggie',
      price: 25.0,
      image: '/images/chicken_parmesan.jpg',
    },
  ]

export default function ProductTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-600 text-sm border-b">
            <th className="p-3">✓</th>
            <th className="p-3">Nama Produk</th>
            <th className="p-3">Item ID</th>
            <th className="p-3">Stok</th>
            <th className="p-3">Kategori</th>
            <th className="p-3">Harga</th>
            <th className="p-3">Ketersediaan</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {initialProducts.map((initialProducts, i) => (
            <ProductRow key={i} data={initialProducts} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
