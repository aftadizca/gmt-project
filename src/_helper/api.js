import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44319/api/",
  withCredentials: true
});
