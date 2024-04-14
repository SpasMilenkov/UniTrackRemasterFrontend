import LoginDto from "../interfaces/requests/LoginDto";
import { RegisterDto } from "../interfaces/requests/RegisterDto";
import axiosInstance from "./axiosInstance";

const login = async (loginDto: LoginDto) => {
    const result = await axiosInstance.post('Auth/login', loginDto)
    return result
}

const register = async (registerDto: RegisterDto) => {
    const result = await axiosInstance.post('Auth/register', registerDto)
    return result
}

const logout = async () => {
    const result = await axiosInstance.post('Auth/logout')
    return result
}
export {login, register, logout}