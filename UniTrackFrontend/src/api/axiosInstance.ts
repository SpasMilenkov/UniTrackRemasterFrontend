import axios from 'axios'
import router from '../router'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5086/api',
    timeout: 5000, // Timeout of 5 seconds
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})


//Handle token expiration and attempt refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Check if the error is due to token expiration
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                // Attempt to get a new access token using the refresh token
                await axiosInstance.post('auth/refresh')

                // Retry the original request
                return axiosInstance(originalRequest)
            } catch (refreshError) {
                // Handle failed refresh (e.g., log out user)
                router.push('/login')
            }
        }

        return Promise.reject(error)
    }
)


export default axiosInstance