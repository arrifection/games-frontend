import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        } else {
            delete api.defaults.headers.common["Authorization"];
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user", err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", { email, password });
            const { access_token, username, email: userEmail } = res.data;
            localStorage.setItem("token", access_token);
            setToken(access_token);
            setUser({ username, email: userEmail });
            return { success: true };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.detail || "Login failed"
            };
        }
    };

    const signup = async (username, email, password) => {
        try {
            await api.post("/auth/register", { username, email, password });
            return await login(email, password);
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.detail || "Signup failed"
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common["Authorization"];
    };

    const saveHistory = async (activityType, inputData, outputResult) => {
        if (!user) return;
        try {
            await api.post("/history/add", {
                activity_type: activityType,
                input_data: inputData,
                output_result: outputResult
            });
        } catch (err) {
            console.error("Failed to save history", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, saveHistory }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
