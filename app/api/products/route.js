import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Fetching the products from database
export async function GET(request) {
    console.log('hit products api get')

    // getting the query parameter from url to fetch products of that category
    const yourParamName = request.nextUrl.searchParams.get('category');
    console.log(yourParamName);
    let data;

    // if query parameter is present, fetch the products of that category
    if (yourParamName) {
        data = await sql`SELECT * FROM products WHERE category=${yourParamName};`;
    }
    // else fetch all the products
    else {
        data = await sql`SELECT * FROM products;`;
    }
    console.log(data.rows);
    return NextResponse.json(data.rows);
}

// Adding the product to database
export async function POST(request) {
    console.log('hit products api post');
    const { productName, productRate, productCategory } = await request.json();

    // getting the gst of the category to which the product belongs
    const { rows } = await sql`SELECT * FROM categories;`;
    const gst = rows.find(row => row.name == productCategory).gst;
    const data = await sql`INSERT INTO products (product, rate, category, gst) VALUES (${productName}, ${productRate}, ${productCategory}, ${gst}) RETURNING *;`;
    return NextResponse.json(data.rows[0]);
}
