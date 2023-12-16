'use client';

import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Billing() {
  const [totalBill, setTotalBill] = useState(0);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [billedProducts, setBilledProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('none');
  const [selectedProduct, setSelectedProduct] = useState('none');
  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        setSelectedCategory(data[0]);
        return fetch(`/api/products?category=${data[0]}`)
      })
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        setSelectedProduct(data[0]?.product)
      });
  }, []);
  useEffect(() => {
    fetch(`/api/products?category=${selectedCategory}`)
      .then(response => response.json())
      .then(data => setProducts(data));
  }
    , [selectedCategory]);

  useEffect(() => {
    setSelectedProduct(products[0]?.product);
  }
    , [products]);

  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
  }


  function handleGenerateBill() {
    if (cart.length == 0) {
      alert("Cart is empty");
      return;
    }

    let bill = 0;
    let newBilledProducts = [];
    cart.forEach(product => {
      let totalAmount = product.rate * product.quantity;
      let gst = totalAmount * product.gst / 100;
      let totalAmountWithGst = totalAmount + gst;
      product.total = totalAmountWithGst;
      newBilledProducts.push(product);
      bill += totalAmountWithGst;
    });
    setBilledProducts(newBilledProducts);
    setCart([]);
    setTotalBill(bill);
  }

  function handleAddToCart() {
    // Your function implementation
    console.log(selectedProduct)
    let product = products.find(product => product.product == selectedProduct);
    product.quantity = quantity;
    setCart([...cart, product]);

  }
  return (
    <>
      <div className="navigation">
        <div>
          <Link href="/addCategories">Add Categories</Link>
          <Link href="/addProducts">Add Products</Link>
        </div>
        <div>
          <select name="category" defaultValue={selectedCategory} onChange={handleCategoryChange} id="categorySelect">
            {categories?.map((category) => <option value={category}>{category}</option>)}
          </select>
          <select name="product" defaultValue={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} id="productSelect">
            {products?.map(product => <option value={product.product}>{product.product}</option>)}
          </select>
          <input type="number" value={quantity} name="quantity" id="quantity" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
          <button onClick={handleAddToCart} id="addButton">Add</button>
        </div>
      </div>
      <div className='p-5'>
        <h2>Cart Table</h2>
        <table>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>GST</th>
          </tr>
          {cart.map((product) => <tr>
            <td>{product.product}</td>
            <td>{product.category}</td>
            <td>{product.quantity}</td>
            <td>{product.rate}</td>
            <td>{product.gst}</td>
          </tr>)}
        </table>

        <h2>Bill Table</h2>
        <table>
          <tr>
            <th>Product Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>GST</th>
            <th>Total</th>
          </tr>
          {billedProducts.map((product) => <tr>
            <td>{product.product}</td>
            <td>{product.category}</td>
            <td>{product.quantity}</td>
            <td>{product.rate}</td>
            <td>{product.gst}</td>
            <td>{product.total}</td>
          </tr>)}
        </table>
        <span>Total Amount: </span><span>{totalBill}</span>
        <button onClick={handleGenerateBill}>Generate Bill</button>
      </div>
    </>
  )
}