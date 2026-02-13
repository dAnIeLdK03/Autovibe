import { useEffect, useState } from "react";

export const useImageUpload = () =>  {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if(selectedFile){
            if(imagePreview){
                URL.revokeObjectURL(imagePreview);
            }
            
            setImageFile(selectedFile);
            const objectUrl = URL.createObjectURL(selectedFile);
            setImagePreview(objectUrl);
        }
    };

    useEffect(() => {
        return () => {
            if(imagePreview){
                URL.revokeObjectURL(imagePreview);
            }
        }
    }, [imagePreview]);

    return {
        imageFile,
        imagePreview,
        handleImageChange,
        setImageFile,
        setImagePreview,
    }
}
