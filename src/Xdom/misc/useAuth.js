import { useContext } from "react";
import { AuthContextFM } from "./contextApp";

const useAuth = () => {
    return useContext (AuthContextFM)
}

export default useAuth