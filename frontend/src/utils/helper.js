import axios from "axios";

export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/helpdesk/user/profile",
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    console.error(
      "Error fetching user profile:",
      err.response?.data || err.message
    );
    throw err;
  }
};
