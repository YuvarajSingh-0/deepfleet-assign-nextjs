'use client';
import { useRef } from "react";
export default function AddCategories() {
    const categoryNameRef = useRef();
    const gstRef = useRef();

    // handling the addition of category to database
    function handleAddCategory() {
        let categoryName = categoryNameRef.current.value;
        let gst = gstRef.current.value;

        // if category name is empty, alert the user
        if (categoryName == "") {
            alert("Category Name is required");
            return;
        }

        // if gst is empty, alert the user
        if (gst == "") {
            alert("GST is required");
            return;
        }

        // post the category details to backend
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
            <button onClick={() => window.history.back()} className=' absolute top-0 left-0 m-4 rounded-full px-3 py-2 text-[#8f57ea] bg-[#f3f3f9]'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#8f57ea" height="20" width="20" viewBox="0 0 448 512"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" /></svg>
            </button>
        </div>
    )
}
