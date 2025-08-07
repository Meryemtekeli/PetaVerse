import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, Product } from "../../services/api/ecommerceApi";

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getProducts(category).then(setProducts);
  }, [category]);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Pet Ürünleri</h2>
      <div className="mb-4 flex gap-2">
        <select value={category} onChange={e => setCategory(e.target.value)} className="input w-48">
          <option value="">Tüm Kategoriler</option>
          <option value="food">Mama</option>
          <option value="toys">Oyuncak</option>
          <option value="accessories">Aksesuar</option>
          <option value="health">Sağlık</option>
          <option value="grooming">Bakım</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="input flex-1"
        />
        <Link to="/shop/sell" className="btn-primary">Ürün Sat</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Link key={product.id} to={`/shop/product/${product.id}`} className="block bg-white rounded shadow hover:shadow-lg transition">
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover rounded-t" />
            <div className="p-4">
              <div className="font-bold text-lg mb-2">{product.title}</div>
              <div className="text-gray-600 mb-2">{product.category}</div>
              <div className="font-bold text-lg text-primary-600 mb-2">{product.price} {product.currency}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>⭐ {product.rating}</span>
                <span>({product.reviewCount})</span>
                <span className="ml-auto">{product.location}</span>
              </div>
            </div>
          </Link>
        ))}
        {filteredProducts.length === 0 && <div className="text-gray-500 col-span-full text-center py-8">Ürün bulunamadı.</div>}
      </div>
    </div>
  );
};

export default ShopPage; 