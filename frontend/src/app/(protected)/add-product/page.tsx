'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArrowRight } from 'lucide-react';
import productApi from '@/services/product-api';

// Validation schema
const productSchema = z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    price: z.string()
        .min(1, 'Price is required')
        .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a number with up to 2 decimal places'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

export default function AddProductPage() {
    const [product, setProduct] = useState({ name: '', price: '', description: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const nameRef = useRef<HTMLInputElement>(null);
    const priceRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        const validationResult = productSchema.safeParse(product);

        if (!validationResult.success) {
            const fieldErrors: { [key: string]: string } = {};
            validationResult.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0]] = err.message;
                }
            });
            setErrors(fieldErrors);

            // Focus first invalid field
            if (fieldErrors.name) nameRef.current?.focus();
            else if (fieldErrors.price) priceRef.current?.focus();
            else if (fieldErrors.description) descRef.current?.focus();
            return;
        }

        try {
            setIsLoading(true);
            await productApi.post('/products/create', product);
            toast.success('Product added successfully!');
            router.push('/products');
            
        } catch (err) {
            console.log('Err : ', err)
            toast.error('Failed to add product.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        id="name"
                        ref={nameRef}
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="text"
                        id="price"
                        ref={priceRef}
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        ref={descRef}
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="group flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Product'}
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
                    </button>
                </div>
            </form>
        </div>
    );
}
