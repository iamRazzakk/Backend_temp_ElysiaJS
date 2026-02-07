interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
    };
};

export const errorResponse = (message: string, data?: any): ApiResponse => {
    return {
        success: false,
        message,
        data,
    };
};
