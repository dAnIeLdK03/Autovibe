import { useCallback } from "react";
import { Alert } from "react-native";
import { extractApiErrorMessage } from "../../shared/extractErrorMessage/extractApiErrorMessage"; 

export const useError = () => {
    const handleError = useCallback((error: unknown) => {
        const message = extractApiErrorMessage(error);
        
        // Показва системен диалог
        Alert.alert("Error", message, [{ text: "OK" }]);
        
        return message;
    }, []);

    return { handleError };
};