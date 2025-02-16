import axiosInstance from "./axiosInstance";

interface Schedule {
  phone: string;
  time: string;
}

export const schedule = async (schedule: Schedule) => {
  try {
    const response = await axiosInstance.post("/api/schedule-call", schedule);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
