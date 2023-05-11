import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { UserModel } from '@models/userModel';
import { useUser } from '@hooks/useUser';
import { useMenu } from '@hooks/useMenu';
import { useSiteType } from '@hooks/useSiteType';
import { TOKEN } from '@constants/auth';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserModel | null;
  permissions: string[] | null;
}

interface AuthContextValue extends State {
  platform: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: UserModel | null;
    permissions: string[] | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: UserModel;
    permissions: string[];
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
  payload: {
    user: UserModel;
  };
};

type Action = InitializeAction | LoginAction | LogoutAction | RegisterAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  permissions: null,
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user, permissions } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      permissions,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user, permissions } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      permissions,
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null,
    permissions: null,
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { requestLogin, requestLogout, getMeAccount } = useUser();
  const { getPermissions } = useMenu();
  const siteType = useSiteType();
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = window.localStorage.getItem(TOKEN);

        if (accessToken) {
          const user = await getMeAccount();
          const permissions = await getPermissions();

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
              permissions,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
              permissions: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            permissions: null,
          },
        });
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    await requestLogin({
      email,
      password,
      otpVerifyCode: '',
    });

    const user = await getMeAccount();

    if (user.type !== siteType) {
      localStorage.removeItem(TOKEN);
      throw Error('로그인 권한이 없습니다.');
    }

    const permissions = await getPermissions();

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        permissions,
      },
    });
  };

  const logout = async (): Promise<void> => {
    await requestLogout();
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email: string, name: string, password: string): Promise<void> => {
    // TODO: 회원가입 관련 기능은 없어서 일단 주석처리
    // const accessToken = await authApi.register({ email, name, password });
    // localStorage.setItem(TOKEN, accessToken);
    // dispatch({
    //   type: 'REGISTER',
    //   payload: {
    //     user,
    //   },
    // });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
