import axiosInstance from "./axiosInstance";

interface User {
  name: string,
  email: string,
  phone: string,
  password: string
}

export const createUser = async (userData: User) => { //sending data to the backend
  try {
    const response = await axiosInstance.post("/api/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
