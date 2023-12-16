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
    console.log(selectedProduct)
    let cartProduct = cart.find(product => product.product == selectedProduct);
    if (cartProduct) {
      cartProduct.quantity += Number(quantity);
      setCart([...cart]);
      return;
    }
    let product = products.find(product => product.product == selectedProduct);
    product.quantity = Number(quantity);
    setCart([...cart, product]);

  }
  return (
    <>
      <div className='m-5'>
        <div className=" flex-row-reverse lg:float-right p-10 flex gap-10">
          <Link className='bg-[#6660b5] text-white hover:drop-shadow-2xl transition-all ease-in-out p-4 rounded-md' href="/addCategories">Add Categories</Link>
          <Link className='bg-[#6660b5] text-white hover:drop-shadow-2xl transition-all ease-in-out p-4 rounded-md' href="/addProducts">Add Products</Link>
        </div>
        <h1 className='text-5xl mb-5 font-semibold leading-relaxed'>Billing</h1>
        <div className='flex gap-10'>
          <select className='p-3 bg-[#f3f3f9] rounded-md' name="category" defaultValue={selectedCategory} onChange={handleCategoryChange} id="categorySelect">
            {categories?.map((category, i) => <option key={i} className='p-3 bg-[#f3f3f9] rounded-md' value={category}>{category}</option>)}
          </select>
          {products.length == 0 ? <Link href='/addProducts' className=' self-center underline text-center text-[#8f57ea]'>Add Some Products First</Link>: 
          <select className='p-3 bg-[#f3f3f9] rounded-md' name="product" defaultValue={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} id="productSelect">
            {products?.map((product, i) => <option key={i} className='p-3 bg-[#f3f3f9] rounded-md' value={product.product}>{product.product}</option>)}
          </select>}
          <input className='p-3 bg-[#f3f3f9] rounded-md' type="number" value={quantity} name="quantity" id="quantity" placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
          <button className='bg-[#6660b5] text-white hover:drop-shadow-2xl transition-all ease-in-out px-5 py-3 rounded-md' onClick={handleAddToCart} id="addButton">Add</button>
        </div>
      </div>
      <div className='lg:flex'>
        <div className='p-5 mb-7 flex-[2]'>
          <h2 className='text-4xl mb-5 font-semibold'>Cart</h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">GST</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((product, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{product.product}</td>
                  <td className="border px-4 py-2">{product.category}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">{product.rate}</td>
                  <td className="border px-4 py-2">{product.gst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='p-5 flex-[2.7]'>
          <h2 className='text-4xl mb-5 font-semibold'>Bill Table</h2>
          <table className="table-auto w-full mb-5">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">GST</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {billedProducts.map((product, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{product.product}</td>
                  <td className="border px-4 py-2">{product.category}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">{product.rate}</td>
                  <td className="border px-4 py-2">{product.gst}</td>
                  <td className="border px-4 py-2">{product.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='flex justify-between'>
            <p className='p-3 bg-[#f3f3f9] text-[#8f57ea] rounded-md'>Total amount ${totalBill}</p>
            <button className='float-right bg-[#8f57ea] text-white px-5 py-3 rounded-md' onClick={handleGenerateBill}>Generate Bill</button>
          </div>
        </div>
      </div>

    </>
  )
}