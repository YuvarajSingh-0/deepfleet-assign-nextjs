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
        <div>
            <h1>add products</h1>
            <table>
                <tr>
                    <td><label htmlFor="productName">product name</label></td>
                    <td><input ref={productNameRef} type="text" name="productName" id="productName" placeholder="product name" /></td>
                </tr>
                <tr>
                    <td><label htmlFor="productRate">Product Price</label></td>
                    <td><input ref={productRateRef} type="number" name="productRate" id="productRate" placeholder="product Price" /></td>
                </tr>
                <tr>
                    <td><label htmlFor="productCategory">Product Category</label></td>
                    <td>
                        <select name="category" ref={productCategoryRef} id="category">
                            {categories?.map((category) => <option value={category}>{category}</option>)}
                        </select>
                    </td>
                </tr>
                <tr>
                    <button onClick={handleAddProduct}>Add product</button>
                </tr>
            </table>
        </div>
    )
}
