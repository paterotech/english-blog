import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [blog, setBlog] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [input, setInput] = useState("");

    const fetchBlogs = async ()=> {
        try {
            const {data} = await axios.get('/api/blog/all')
            data.success ? setBlog(data.blogs) : toast.error(data.message)

        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoadingBlogs(false)
        }
    }

    // Cargar blogs al iniciar
    useEffect(() => {
        fetchBlogs();
    }, []);

    // Persistir el token en localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Cerrar la sesión si el servidor responde 401
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && localStorage.getItem("token")) {
                    localStorage.removeItem("token");
                    setToken(null);
                    toast.error("Your session has expired. Please log in again.");
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [setToken]);

    const value = {
        axios, navigate, token, setToken, blog, setBlog, loadingBlogs, input, setInput, fetchBlogs
    }

    return (
        <AppContext.Provider value={ value }>{children}</AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    return useContext(AppContext);
};
