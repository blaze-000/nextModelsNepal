import axios from "axios";

const Axios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // Remove the default Content-Type header to allow FormData to set multipart/form-data
    withCredentials: true,
});

export default Axios;
