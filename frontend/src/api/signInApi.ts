import axiosInstance from "./axiosInstance";

interface SignInCredentials {
  email: string,
  password: string
}

export const signIn = async (credentials: SignInCredentials) => {
  try {
    // Add a debug log before making the request
    console.log("Making signin request with:", credentials);
    
    const response = await axiosInstance.post("/api/signin", credentials);
    return response.data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};