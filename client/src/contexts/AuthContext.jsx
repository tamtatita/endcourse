import { createContext, useContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const AuthContext = createContext();

const INITIAL_STATE = {
  currentUser: null,
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  // Tạo một hàm để cập nhật currentUser
  const setCurrentUser = (user) => {
    dispatch({ type: "LOGIN", payload: user });
  };

  return (
    <AuthContext.Provider value={{ state, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
