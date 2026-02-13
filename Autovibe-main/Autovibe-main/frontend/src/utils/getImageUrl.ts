

export const getImageUrl = (path: string | null | undefined) => {
    if(!path) return "https://via.placeholder.com/150";


    const baseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:5258").replace("/api", "");

    if(path.startsWith("http")){
        return path;
    }

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl.replace(/\/$/, "")}${normalizedPath}`;
}