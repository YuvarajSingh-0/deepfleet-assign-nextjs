import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    console.log('hit products api get')
    const yourParamName = request.nextUrl.searchParams.get('category');
    console.log(yourParamName);
    let data;
    if(yourParamName){
        data = await sql`SELECT * FROM products WHERE category=${yourParamName};`;
    }
    else{
        data = await sql`SELECT * FROM products;`;
    }
    console.log(data.rows);
    return NextResponse.json(data.rows);
}

export async function POST(request) {
    console.log('hit products api post');
    const {rows}= await sql`SELECT * FROM categories;`;
    const { productName, productRate, productCategory } = await request.json();
    const gst=rows.find(row=>row.name==productCategory).gst;
    const data = await sql`INSERT INTO products (product, rate, category, gst) VALUES (${productName}, ${productRate}, ${productCategory}, ${gst}) RETURNING *;`;
    return NextResponse.json(data.rows[0]);
}
