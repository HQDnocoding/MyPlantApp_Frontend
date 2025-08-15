
import axios from 'axios'

const BASE_URL = 'http://192.168.2.51:8080/api/'


const endpoints = {
    'predictDiseaseApi': '/predict',
    'authGoogleToken': '/auth/google'
}


const authAPI = () => {
    return axios.create({
        baseURL: BASE_URL,
    })
}

const authMultipartAPI = () => {
    return axios.create({
        baseURL: BASE_URL, headers: {
            'Content-Type': "multipart/form-data"
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})


export { authAPI, authMultipartAPI, endpoints, BASE_URL }