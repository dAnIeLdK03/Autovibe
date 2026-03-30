import toast from "react-hot-toast";
import { extractApiErrorMessage } from "../Validations/extractApiErrorMessage"


export const useError = () => {
    const handleError = (error: unknown) => {

        const message = extractApiErrorMessage(error);
        toast.error(message);
        return message;
    };

    return {handleError};
}