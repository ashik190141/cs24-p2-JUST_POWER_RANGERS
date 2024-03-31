import axios from "axios";

let axiosPublic = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
})

const useAxiosPublic = () => {
    return axiosPublic;
}
export default useAxiosPublic;