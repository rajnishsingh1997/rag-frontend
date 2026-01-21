import api from "@/lib/axios";

interface LoginInterface {
  email: string;
  password: string;
}
interface SignupInterface {
  name: string;
  email: string;
  password: string;
}
export const loginApi = (data: LoginInterface) => api.post("/auth/login", data);
export const signupApi = (data: SignupInterface) => api.post("/auth/signup", data);
