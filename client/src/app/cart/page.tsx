    "use client";

    import { useAuthStore } from "@/store/useAuthStore";
    import { useCartStore } from "@/store/useCartStore";
    import { useRouter } from "next/navigation";
    import React, { useEffect, useState } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Minus, Plus, Trash2 } from "lucide-react";

    const UsercartPage = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const { fetchCart, items, isLoading, removeFromCart, updateCartItemQuantity } = useCartStore();
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleRemoveItem = async (id: string) => {
        setIsUpdating(true);
        await removeFromCart(id);
        setIsUpdating(false);
    };

    const handleUpdateQuantity = async (id: string, newQuantity: number) => {
        setIsUpdating(true);
        await updateCartItemQuantity(id, Math.max(1, newQuantity));
        setIsUpdating(false);
        
    };

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (isLoading || !user) return null;

    return (
        <div className="min-h-screen bg-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
            {/* Page Title */}
            <h1 className="text-4xl font-bold text-center text-black mb-12 tracking-tight">
            Your Cart
            </h1>

            <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Section: Items */}
            <div className="lg:col-span-2 space-y-6">
                {items.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-2xl">
                    <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>
                    <Button
                    onClick={() => router.push("/listing")}
                    className="mt-6 bg-black text-white rounded-full px-6"
                    >
                    Continue Shopping
                    </Button>
                </div>
                ) : (
                items.map((item) => (
                    <div
                    key={item.id}
                    className="flex items-center gap-6 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                    >
                    {/* Product Image */}
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-28 object-cover rounded-xl border"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black">
                        {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">Color: {item.color}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm font-medium text-black mt-1">
                        ${item.price.toFixed(2)}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center border rounded-full px-2 py-1">
                            <Button
                            disabled={isUpdating || item.quantity <= 1}
                            onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-gray-100"
                            >
                            <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                            type="number"
                            className="w-12 text-center border-none focus:ring-0"
                            value={item.quantity}
                            onChange={(e) =>
                                handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value)
                                )
                            }
                            />
                            <Button
                            disabled={isUpdating}
                            onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-gray-100"
                            >
                            <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Remove button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={isUpdating}
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-600"
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>

            {/* Right Section: Summary */}
            <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-gray-50 flex flex-col justify-between">
                <div>
                <h2 className="text-xl font-semibold text-black mb-6">
                    Order Summary
                </h2>

                <div className="flex justify-between text-gray-700 mb-2">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 mb-2">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-black mt-4 border-t pt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                </div>

                <div className="mt-6 space-y-3">
                <Button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-black text-white rounded-full py-6 text-lg font-medium hover:opacity-90 transition"
                >
                    Proceed to Checkout
                </Button>
                <Button
                    onClick={() => router.push("/listing")}
                    variant="outline"
                    className="w-full rounded-full py-6 text-lg font-medium"
                >
                    Continue Shopping
                </Button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default UsercartPage;
