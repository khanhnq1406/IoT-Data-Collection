import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { apiUrl } from "../contexts/constants";
import axios from "axios";
const GetFullName = async () => {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const response = await axios.get(`${apiUrl}/database/getfullname`, {
    params: {
      username: user,
    },
  });
  const fullName =
    response.data[0].first_name + " " + response.data[0].last_name;
  return fullName;
};
export default GetFullName;
