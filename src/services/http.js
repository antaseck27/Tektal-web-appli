import axios from "axios";
import { API_URL } from "../config/api";

const http = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

export default http;
