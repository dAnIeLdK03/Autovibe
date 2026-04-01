import toast from "react-hot-toast";
import { extractApiErrorMessage } from "../Validations/extractApiErrorMessage"
import { useCallback } from "react";


export const useError = () => {
    const handleError = useCallback((error: unknown) => {

        const message = extractApiErrorMessage(error);
        toast.error(message);
        return message;
    }, []);

    return {handleError};
}