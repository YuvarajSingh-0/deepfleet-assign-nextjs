'use client';

import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Billing() {

  const [totalBill, setTotalBill] = useState(0); // total bill of cart products
  const [cart, setCart] = useState([]); // cart products
  const [categories, setCategories] = useState([]); // categories available in database
  const [billedProducts, setBilledProducts] = useState([]); // products after calulating bill
  const [products, setProducts] = useState([]); // products of selected category
  const [quantity, setQuantity] = useState(1); // quantity of selected product default 1
  const [selectedCategory, setSelectedCategory] = useState('none'); // selected category from dropdown
  const [selectedProduct, setSelectedProduct] = useState('none'); // selected product from dropdown

  // Filling up the categories in select tag available in database
  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data);    // setting the categories in state
        setSelectedCategory(data[0]);   // setting the default category
        return fetch(`/api/products?category=${data[0]}`) // after setting the default category, fetching the products of that category
      })
      .then(response => response.json())
      .then(data => {
        setProducts(data)  // setting the products of selected/default category in state
        setSelectedProduct(data[0]?.product);  // setting the default product 
      });
  }, []);

  // Fetching the products of selected category
  useEffect(() => {
    fetch(`/api/products?category=${selectedCategory}`)
      .then(response => response.json())
      .then(data => setProducts(data)); // setting the products of selected category in state
  }
    , [selectedCategory]);

  //whenever products list is changed by changing selected category, default product is set to first product in list
  useEffect(() => {
    setSelectedProduct(products[0]?.product);
  }
    , [products]);

  // handling the change of category
  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value); // setting the selected category in state
  }

  // handling the generation of bill
  function handleGenerateBill() {
    // if cart is empty, alert the user
    if (cart.length == 0) {
      alert("Cart is empty");
      return;
    }

    // calculating the total bill
    let bill = 0;
    let newBilledProducts = []; //resetting the billed products array

    // calculating the total amount of each product and adding it to total bill
    cart.forEach(product => {
      let totalAmount = product.rate * product.quantity; // total amount of product
      let gst = totalAmount * product.gst / 100; // gst of product
      let totalAmountWithGst = totalAmount + gst; // total amount of product with gst
      product.total = totalAmountWithGst; //setting the total property of product object
      newBilledProducts.push(product); // pushing the product in billed products array
      bill += totalAmountWithGst; // total amount of card products
    });
    setBilledProducts(newBilledProducts); // setting the billed products in state
    setCart([]); // emptying the cart
    setTotalBill(bill); // setting the total bill in state
  }

  // handling the addition of product to cart
  function handleAddToCart() {
    // checking if the product is already in cart
    let cartProduct = cart.find(product => product.product == selectedProduct);
    // if product is already in cart, increase the quantity of product
    if (cartProduct) {
      cartProduct.quantity += Number(quantity);
      setCart([...cart]);
      return;
    }

    // if product is not in cart, add the product to cart by setting the quantity property
    let product = products.find(product => product.product == selectedProduct);
    product.quantity = Number(quantity);
    setCart([...cart, product]);

  }
  return (
    <>
      <div className='m-5'>
        {/* Add Products and Categories */}
        <div className=" flex-row-reverse lg:float-right p-10 flex gap-10">
          <Link className='bg-[#6660b5] text-white hover:drop-shadow-2xl transition-all ease-in-out p-4 rounded-md' href="/addCategories">Add Categories</Link>
          <Link className='bg-[#6660b5] text-white hover:drop-shadow-2xl transition-all ease-in-out p-4 rounded-md' href="/addProducts">Add Products</Link>
        </div>
        <h1 className='text-5xl mb-5 font-semibold leading-relaxed'>Billing</h1>
        {/* Add Product to cart */}
        <div className='flex gap-10'>
          <select className='p-3 bg-[#f3f3f9] rounded-md' name="category" defaultValue={selectedCategory} onChange={handleCategoryChange} id="categorySelect">
            {categories?.map((category, i) => <option key={i} className='p-3 bg-[#f3f3f9] rounded-md' value={category}>{category}</option>)}
          </select>
          {products.length == 0 ? <Link href='/addProducts' className=' self-center underline text-center text-[#8f57ea]'>Add Some Products First</Link> :
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
          {/* Cart Table  */}
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
          {/* Bill Table  */}
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
          {/* Total Amount and Generate Bill Button */}
          <div className='flex justify-between'>
            <p className='p-3 bg-[#f3f3f9] text-[#8f57ea] rounded-md'>Total amount ${totalBill}</p>
            <button className='float-right bg-[#8f57ea] text-white px-5 py-3 rounded-md' onClick={handleGenerateBill}>Generate Bill</button>
          </div>
        </div>
      </div>

    </>
  )
}