import { API_ORIGIN } from "../services/api";


export const getImageUrl = (path: string | null | undefined) => {
    if(!path) return "https://via.placeholder.com/150";

    if (path.startsWith("blob:") || path.startsWith("data:")) {
        return path;
    }

    const baseUrl = `${API_ORIGIN}`.replace("/api", "");

    if(path.startsWith("http")){
        return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
}