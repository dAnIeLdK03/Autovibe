import { API_ORIGIN } from "../api/api";


export const getImageUrl = (path: string | null | undefined) => {
    if (!path) return "https://via.placeholder.com/150";

    if (path.startsWith("blob:") || path.startsWith("data:") || path.startsWith("http") || path.startsWith("file:")) {
        return path;
    }

    const baseUrl = API_ORIGIN.replace("/api", "").replace(/\/$/, "");

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${normalizedPath}`;
}