// ----------------------------------------------------------------------

export type ActionMapType<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  };
};

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading?: boolean;
  user: any;
};

export type JWTContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: any;
  isLoading?: boolean;
  initialize: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};
