import { NextResponse } from 'next/server'
import { sql } from "@vercel/postgres";

// Fetching the categories from database
export async function GET(request) {
    console.log("hit categories api get");

    // Fetching the categories from database
    const data = await sql`SELECT distinct name FROM categories;`;
    let categories = [];
    for (const category of data.rows) {
        categories.push(category.name)
    }
    return NextResponse.json(categories);
}

// Adding the category to database
export async function POST(request) {
    console.log("hit categories api post");
    const { categoryName, gst } = await request.json();
    const data = await sql`INSERT INTO categories (name, gst) VALUES (${categoryName}, ${gst}) RETURNING *;`;
    return NextResponse.json(data.rows[0]);
}