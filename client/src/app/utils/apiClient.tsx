import { BASE_API_URL, BASE_API_VERSION } from "@/app/consts";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${BASE_API_URL}/${BASE_API_VERSION}`,
});
