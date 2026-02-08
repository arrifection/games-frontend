import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = ({ onToggle }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-emerald-50">
            <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Welcome Back</h2>
            <p className="text-gray-500 text-center mb-8">Login to your NutriPro account</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-500 text-sm">
                    Don't have an account?{" "}
                    <button onClick={onToggle} className="text-emerald-600 font-bold hover:underline">
                        Sign up instead
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
