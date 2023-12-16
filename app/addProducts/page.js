'use client';
import { useState, useRef, useEffect } from 'react'
export default function AddCategories() {
    const productNameRef = useRef();
    const productRateRef = useRef();
    const productCategoryRef = useRef();

    const [categories, setCategories] = useState([]); // categories available in database to select which catgory the product belongs to while creating product

    // Filling up the categories in select tag(dropdown menu) available in database
    useEffect(() => {
        fetch('/api/categories')
            .then(response => response.json())
            .then(data => setCategories(data));
    }, []);

    // handling the addition of product to database
    function handleAddProduct() {
        let productName = productNameRef.current.value;
        let productRate = productRateRef.current.value;
        let productCategory = productCategoryRef.current.value;

        // if product name is empty, alert the user
        if (productName == "") {
            alert("Product Name is required");
            return;
        }

        // if product rate is empty, alert the user
        if (productRate == "") {
            alert("Product Rate is required");
            return;
        }
        // if product category is empty, alert the user
        if (productCategory == "") {
            alert("Product Category is required");
            return;
        }

        // post the product details to backend
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productName, productRate, productCategory })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.message);
                    return;
                }
                alert("Product added successfully");

                // clearing the input fields
                productNameRef.current.value = "";
                productRateRef.current.value = "";
            })
    }
    return (
        <div className='mt-32 flex flex-col w-full justify-center items-center align-middle'>
            <h1 className='text-5xl font-semibold mb-5'>Add Products</h1>
            <div className='flex flex-col gap-5 justify-center items-center align-middle'>

                <input ref={productNameRef} type="text" name="productName" id="productName" placeholder="Product Name" className='p-3 outline-[#8780ef] w-max bg-[#f3f3f9] rounded-md' />
                <input ref={productRateRef} type="number" name="productRate" id="productRate" placeholder="Product Price" className='p-3 outline-[#8780ef] w-max bg-[#f3f3f9] rounded-md' />
                <select name="category" ref={productCategoryRef} id="category" className='p-3 w-full outline-[#8780ef] bg-[#f3f3f9] rounded-md'>
                    {categories?.map((category) => <option value={category} key={category}>{category}</option>)}
                </select>
                <button className='bg-[#6660b5] text-white hover:drop-shadow-2xl w-max outline-[#8780ef] transition-all ease-in-out px-4 py-3 rounded-md' onClick={handleAddProduct}>
                    Add Product
                </button>
            </div>
            <button onClick={() => window.history.back()} className=' absolute top-0 left-0 m-4 rounded-full px-3 py-2 text-[#8f57ea] bg-[#f3f3f9]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#8f57ea" height="20" width="20" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
            </button>
        </div>
    )
}
