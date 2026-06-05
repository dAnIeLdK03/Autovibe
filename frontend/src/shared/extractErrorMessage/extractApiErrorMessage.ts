import axios from 'axios';

function messageFromResponseData(data: unknown): string | undefined {
    if (data == null) return undefined;
    if (typeof data === 'string' && data.trim()) return data;
    if (typeof data !== 'object') return undefined;

    const record = data as Record<string, unknown>;
    const msg = record.message ?? record.Message;
    if (typeof msg === 'string' && msg.trim()) return msg;

    if (record.errors && typeof record.errors === 'object') {
        const allErrors = Object.values(record.errors as Record<string, unknown>).flat();
        const text = allErrors.filter((e): e is string => typeof e === 'string').join(' ');
        if (text.trim()) return text;
    }

    return undefined;
}

export const extractApiErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const fromBody = messageFromResponseData(error.response?.data);
        if (fromBody) return fromBody;
        return error.message || 'Network error occurred.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred';
};

export const msg = (err: unknown) =>
        err && typeof err === "object" &&
            "message" in err ? String((err as
                { message: string }).message) : "Unable to load your cars.";
