import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        isAuthenticated: false,
        role: 'guest',
        schoolId: '',
    }),
    getters: {
        authenticationStatus(state) {
            return state.isAuthenticated
        },
        getRole(state) {
            return state.role
        },
        getSchoolId(state){
            return state.schoolId
        }
    },
    actions: {
        authenticateUser() {
            this.isAuthenticated = true
        },
        setRole(newRole: string) {
            this.role = newRole
        },
        setSchoolId(userSchoolId: string){
            this.schoolId = userSchoolId
        }
    },
})
