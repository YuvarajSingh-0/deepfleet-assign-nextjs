import { NextResponse } from 'next/server'
import { sql } from "@vercel/postgres";

export async function GET(request) {
    console.log("hit categories api get");
    const data = await sql`SELECT distinct name FROM categories;`;
    let categories = [];
    for (const category of data.rows) {
        categories.push(category.name)
    }
    console.log(categories)
    return NextResponse.json(categories);
}

export async function POST(request) {
    console.log("hit categories api post");
    const { categoryName, gst } = await request.json();
    const data = await sql`INSERT INTO categories (name, gst) VALUES (${categoryName}, ${gst}) RETURNING *;`;
    return NextResponse.json(data.rows[0]);
}