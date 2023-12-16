'use client';
import { useRef } from "react";
export default function AddCategories(){
    const categoryNameRef = useRef();
    const gstRef = useRef();
    function handleAddCategory(){
        let categoryName = categoryNameRef.current.value;
        let gst = gstRef.current.value;
        if(categoryName == ""){
            alert("Category Name is required");
            return;
        }
        if(gst == ""){
            alert("GST is required");
            return;
        }
        fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({categoryName, gst})
        })
        .then(response => response.json())
        .then(data => {
            if(data.error){
                alert(data.message);
                return;
            }
            alert("Category added successfully");
            categoryNameRef.current.value = "";
            gstRef.current.value = "";
        })
    }
    return(
        <div>
            <h1>Add Category</h1>
            <table>
                <tr>
                    <td><label htmlFor="categoryName">Category Name</label></td>
                    <td><input ref={categoryNameRef} type="text" name="categoryName" id="categoryName" placeholder="Category Name"/></td>
                </tr>
                <tr>
                    <td><label htmlFor="categoryGst">GST</label></td>
                    <td><input ref={gstRef} type="number" name="categoryGst" id="categoryGst" placeholder="Category GST"/></td>
                </tr>
                <tr>
                    <button onClick={handleAddCategory}>Add Category</button>
                </tr>
            </table>
        </div>
    )
}
