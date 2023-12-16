'use client';
import { useState, useRef, useEffect } from 'react'
export default function AddCategories() {
    const productNameRef = useRef();
    const productRateRef = useRef();
    const productCategoryRef = useRef();

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch('/api/categories')
            .then(response => response.json())
            .then(data => setCategories(data));
    }, []);
    function handleAddProduct(){
        let productName = productNameRef.current.value;
        let productRate = productRateRef.current.value;
        let productCategory = productCategoryRef.current.value;
        if(productName == ""){
            alert("Product Name is required");
            return;
        }
        if(productRate == ""){
            alert("Product Rate is required");
            return;
        }
        if(productCategory == ""){
            alert("Product Category is required");
            return;
        }
        fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productName, productRate, productCategory})
        })
        .then(response => response.json())
        .then(data => {
            if(data.error){
                alert(data.message);
                return;
            }
            alert("Product added successfully");
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
        </div>
    )
}
