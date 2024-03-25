import axios from "axios";

let axiosPublic = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true,
})

const useAxiosPublic = () => {
    return axiosPublic;
}
export default useAxiosPublic;