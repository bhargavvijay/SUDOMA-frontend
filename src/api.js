import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:4000/api",
    timeout:3000,
});

export const register = async (data) => {
    try {
        // Send the registration request
        const response = await apiClient.post('/register', data);
        return response; // Return the response if successful
    } catch (exception) {
        // Check if the error has a response object and return details accordingly
        if (exception.response) {
            return {
                error: true,
                status: exception.response.status, // HTTP status code
                message: exception.response.data.message || 'An error occurred.', // Message from the backend or default message
            };
        } else {
            return {
                error: true,
                message: exception.message || 'An error occurred without response.',
            };
        }
    }
};

export const login=async(data)=>{
    try{
        return await apiClient.post('/login',data);
    } catch(exception){
        return {
            error: true,
            exception,
        }
    }
}

export const forgotPassword=async(data)=>{
    try{
        return await apiClient.post('/forgot-password',data);
    } catch(exception) {
        return {
            error: true,
            exception,
        }
    }
}

export const resetPassword=async(data,token)=>{
    try{
        const d={newPassword:data};
        return await apiClient.post(`/reset-password/${token}`,d);
    }
    catch(exception){
        return{
            error:true,
            exception
        }
    }
}
