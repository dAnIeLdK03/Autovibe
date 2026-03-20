

export const getImageUrl = (path: string | null | undefined) => {
    if(!path) return "https://via.placeholder.com/150";

    if (path.startsWith("blob:") || path.startsWith("data:")) {
        return path;
    }

    const baseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:5258").replace("/api", "");

    if(path.startsWith("http")){
        return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
}