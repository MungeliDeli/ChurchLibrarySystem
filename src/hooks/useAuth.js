import { useDispatch, useSelector } from "react-redux";
import {
  selectAuth,
  setGuest,
  setAuthenticated,
  setUnauthenticated,
  logout,
} from "../store/slices/authSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  return {
    ...auth,
    guest: () => dispatch(setGuest()),
    authenticate: (user) => dispatch(setAuthenticated(user)),
    unauthenticate: () => dispatch(setUnauthenticated()),
    logout: () => dispatch(logout()),
  };
}
