import { baseUrl } from "@/app/consts";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${baseUrl}`,
});
