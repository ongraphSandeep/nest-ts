// import { AuthContext } from "@/context/AuthContextFirebase";
import { AuthContext } from "@/contexts/auth";
import { useContext } from "react";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuthContext context must be use inside AuthProvider");

  return context;
};
