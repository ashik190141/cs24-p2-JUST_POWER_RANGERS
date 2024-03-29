import Swal from "sweetalert2";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const { setLoading, setUser } = useAuth();
  let axiosPublic = useAxiosPublic();
  let navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      let res = await axiosPublic.get("/auth/logout")
      Swal.fire({
        position: "top-middle",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });

    } finally {
      setLoading(false);
    }
  };

  return { logout };
};
export default useLogout;