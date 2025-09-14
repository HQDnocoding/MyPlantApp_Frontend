
import axios from 'axios'

// const BASE_URL = 'http://192.168.2.51:8080/api/'
const BASE_URL = 'http://13.212.49.247:8080/api/'


const endpoints = {
    'predictDiseaseApi': '/predict',
    'authGoogleToken': '/auth/google',
    'authFacebookToken': '/auth/facebook',
    'authRefresh': '/auth/refresh',
    'saveHistory': '/secure/histories',
    'deleteHistory': (id: string) => `/secure/histories?id=${id}`,
    'getHistory': (page: number) => `/secure/histories?page=${page}`,
}




const authAPI = (accessToken: string) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': accessToken ? `Bearer ${accessToken}` : ""
        }
    })
}

const authMultipartAPI = (accessToken: string) => {
    return axios.create({
        baseURL: BASE_URL, headers: {
            'Content-Type': "multipart/form-data",
            'Authorization': accessToken ? `Bearer ${accessToken}` : ""
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})


export { authAPI, authMultipartAPI, endpoints, BASE_URL }