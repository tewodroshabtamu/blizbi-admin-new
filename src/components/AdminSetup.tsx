import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const AdminSetup = () => {
    const { createUserWithEmail, error } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("admin@blizbi.com");
    const [password, setPassword] = useState("Admin123@#@#");
    const [loading, setLoading] = useState(false);

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createUserWithEmail(email, password);
            alert("Admin account created successfully!");
            navigate("/admin/dashboard");
        } catch (err) {
            // Error is handled by the AuthContext
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Admin Account Setup
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create the admin account for Blizbi
                    </p>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-800">{error}</div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blizbi-teal focus:border-blizbi-teal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blizbi-teal focus:border-blizbi-teal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blizbi-teal hover:bg-blizbi-teal/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blizbi-teal disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Admin Account"}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-blizbi-teal hover:text-blizbi-teal/80"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};