import { cookies } from 'next/headers';
import { Product } from '@/types';
import { Edit, Trash2 } from 'lucide-react';

export default async function ProductsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.toString();

    let products: Product[] = [];
    let errorMessage: string | null = null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PRODUCT_DOCKER_API_URL}/products/fetchAll`, {
            method: 'GET',
            headers: {
                cookie: token, // not ideal, just for debugging
            },
            credentials: 'include',
        });

        const data = await res.json();

        if (data.success) {
            products = data.data;
        } else {
            errorMessage = data.error || 'Failed to fetch products.';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        errorMessage = 'An unexpected error occurred while fetching the products.';
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Product List</h1>
            {errorMessage ? (
                <div className="text-red-500">{errorMessage}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md overflow-hidden transition-all hover:scale-105 transform duration-300 group"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{product.name}</h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{product.price}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{product.description}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center bg-[rgba(0,0,0,0.7)] text-white transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                                    <button className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white cursor-pointer">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500">No products available for this tenant.</div>
                    )}
                </div>
            )}
        </div>
    );
}
