/**
 * API Service
 * Centralized API client using Axios
 */

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshQueue: Array<(token?: string) => void> = [];

function processQueue(token?: string) {
    refreshQueue.forEach(cb => cb(token));
    refreshQueue = [];
}

function getAccessToken() {
    try { return localStorage.getItem("access_token"); } catch { return null; }
}
function getRefreshToken() {
    try { return localStorage.getItem("refresh_token"); } catch { return null; }
}
function setTokens(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
}

api.interceptors.request.use(config => {
    const token = getAccessToken();
    if (token && config.headers) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    resp => resp,
    async error => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("/auth/refresh")) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push((token?: string) => {
                        if (!token) { reject(error); return; }
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                isRefreshing = false;
                return Promise.reject(error);
            }

            try {
                const r = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken });
                const { access_token, refresh_token } = r.data;
                setTokens(access_token, refresh_token);

                processQueue(access_token);

                originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
                return api(originalRequest);
            } catch (refreshErr) {
                processQueue(undefined);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export { api, setTokens, getAccessToken, getRefreshToken };
//api.ts