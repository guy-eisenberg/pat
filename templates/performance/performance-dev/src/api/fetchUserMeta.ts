import { api } from "../clients";
import { UserMeta } from "../types";

async function fetchUserMeta() {
  try {
    const { data: strategy } = await api.get<UserMeta>("/get-user-meta.php");

    return strategy;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default fetchUserMeta;
