import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Add Product',
    description: 'Add Product',
}

export default function RootLayout({ children }) {
    return (
        <>
            {children}
        </>
    )
}
