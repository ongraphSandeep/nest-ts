import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useState,
  FC
} from "react";
import axios from "@/configs/axios";
import { ActionMapType, AuthStateType, JWTContextType } from "./types";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// ----------------------------------------------------------------------

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: any;
  };
  [Types.LOGIN]: {
    user: any;
  };
  [Types.REGISTER]: {
    user: any;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
      isLoading: false,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
      isLoading: false,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
      isLoading: false,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      isLoading: false,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const router = useRouter();
  const pathname = usePathname();
  const publicPath = ["/booking", "/login", "/register", "/verify"];

  const setSession = (accessToken: string | null) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem("accessToken");

      delete axios.defaults.headers.common.Authorization;
    }
  };

  const initialize = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        setSession(accessToken);
        const response = await axios.get("/authentication");
        if (response?.data) {
          dispatch({
            type: Types.INITIAL,
            payload: {
              isAuthenticated: true,
              user: { uid: response?.data?.user_id, ...response?.data },
            },
          });
          if (publicPath.includes(pathname)) router.push("/dashboard");
        } else {
          if (!publicPath.includes(pathname)) router.push("/login");
        }
      } else {
        if (!publicPath.includes(pathname)) router.push("/login");
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      if (!publicPath.includes(pathname)) router.push("/login");
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await axios.post("/authentication/log-in", {
        email,
        password,
      });
      const { stsTokenManager } = response.data;
      setSession(stsTokenManager?.accessToken);
      dispatch({
        type: Types.LOGIN,
        payload: {
          user: response.data,
        },
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.log(error?.message || "Something went wrong!");
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email: string, password: string) => {
    try {
      await axios.post("/authentication/register", {
        email,
        password,
      });
      console.log("Register successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error?.message || "Something went wrong!");
    }
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      isLoading: state.isLoading,
      method: "jwt",
      login,
      initialize,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      register,
      logout,
    }),
    [
      state.isAuthenticated,
      state.isInitialized,
      state.user,
      state.isLoading,
      login,
      initialize,
      logout,
      register,
    ]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}


export const ProtectRoute = (WrappedComponent: any): FC => (props: any) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading || !isAuthenticated) {
      return (
        <>
          <p>Unauthenticated</p>
        </>
      );
    }
    return (
      <WrappedComponent
        {...props}
      />
    );
  };