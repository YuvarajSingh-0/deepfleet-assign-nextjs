'use client';
import { useRef } from "react";
export default function AddCategories() {
    const categoryNameRef = useRef();
    const gstRef = useRef();
    function handleAddCategory() {
        let categoryName = categoryNameRef.current.value;
        let gst = gstRef.current.value;
        if (categoryName == "") {
            alert("Category Name is required");
            return;
        }
        if (gst == "") {
            alert("GST is required");
            return;
        }
        fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categoryName, gst })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.message);
                    return;
                }
                alert("Category added successfully");
                categoryNameRef.current.value = "";
                gstRef.current.value = "";
            })
    }
    return (
        <div className='mt-32 flex flex-col w-full justify-center items-center align-middle'>

            <h1 className='text-5xl font-semibold mb-5'>Add Category</h1>
            <div className='flex flex-col gap-5 justify-center items-center align-middle'>

                <input className='p-3 outline-[#8780ef] w-max bg-[#f3f3f9] rounded-md' ref={categoryNameRef} type="text" name="categoryName" id="categoryName" placeholder="Category Name" />
                <input className='p-3 outline-[#8780ef] w-max bg-[#f3f3f9] rounded-md' ref={gstRef} type="number" name="categoryGst" id="categoryGst" placeholder="Category GST" />
                <button className='bg-[#6660b5] text-white hover:drop-shadow-2xl w-max outline-[#8780ef] transition-all ease-in-out px-4 py-3 rounded-md' onClick={handleAddCategory}>Add Category</button>
            </div>
        </div>
    )
}
