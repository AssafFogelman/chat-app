import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { ACTIONS, AuthAction, AuthState, SignUpType } from "./types/types";
import { deleteItemAsync, getItemAsync } from "expo-secure-store";
import axios, { AxiosError } from "axios";
import { useAutoLogin } from "./hooks/useAutoLogin";

const initialAuthDispatchContext = {
  signIn: async () => {},
  signOut: () => {},
  signUp: async (data: SignUpType) => {},
};

const reducerInitialValues: AuthState = {
  chosenPhoto: false,
  chosenBio: false,
  chosenTags: false,
  isAdmin: false,
  isSignOut: false,
  isLoading: true,
  userToken: null,
  userId: "",
};

function authReducer(prevState: AuthState, action: AuthAction) {
  switch (action.type) {
    //used for auto login
    case ACTIONS.RESTORE_TOKEN:
      return {
        ...prevState,
        isLoading: false,
        isSignOut: false,
        userToken: action.data.userToken,
        chosenPhoto: action.data.chosenPhoto,
        chosenBio: action.data.chosenBio,
        chosenTags: action.data.chosenTags,
        isAdmin: action.data.isAdmin,
        userId: action.data.userId,
      };
    case ACTIONS.SIGN_IN:
      return {
        ...prevState,
        isSignOut: false,
        userToken: action.token,
      };
    //used for when there is no token in the secure store
    //and the user signs up  (new or existing user)
    case ACTIONS.SIGN_UP:
      return {
        ...prevState,
        isSignOut: false,
        userToken: action.data.userToken,
        chosenPhoto: action.data.chosenPhoto,
        chosenBio: action.data.chosenBio,
        chosenTags: action.data.chosenTags,
        isAdmin: action.data.isAdmin,
        userId: action.data.userId,
      };
    case ACTIONS.SIGN_OUT:
      return {
        ...prevState,
        isSignOut: true,
        userToken: null,
        isLoading: false,
      };
  }
}

const AuthStateContext = createContext(reducerInitialValues);
const AuthDispatchContext = createContext(initialAuthDispatchContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, reducerInitialValues);
  useAutoLogin();

  const authActions = useMemo(
    () => ({
      signIn: async () => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        // dispatch({ type: ACTIONS.SIGN_IN, token: "dummy-auth-token" });
      },
      signOut: () => {} /*dispatch({ type: "SIGN_OUT" })*/,
      signUp: async (data: SignUpType) => {
        /*
        userId,
        chosenPhoto,
        chosenBio,
        chosenTags,
        isAdmin,
        userToken,
        */
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        dispatch({ type: ACTIONS.SIGN_UP, data: data });
      },
    }),
    []
  );

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={authActions}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );

  function useAutoLogin() {
    useEffect(() => {
      // Fetch the token from storage then navigate to our appropriate place
      const getTokenAsync = async () => {
        let userToken: string | null;
        let user;
        try {
          userToken = await getItemAsync("TILK-token");
          if (userToken) {
            //add the token to the header in every request
            axios.interceptors.request.use((config) => {
              config.headers["TILK-token"] = userToken;
              return config;
            });
            //validate the token in the server and get user details
            user = await axios
              .get("/user/user-data")
              .then((response) => response.data);
            //if everything is OK, update the state. this also makes "isLoading" false.
            const data = {
              userToken,
              userId: user.userId,
              chosenPhoto: user.avatarLink ? true : false,
              chosenBio: user.biography ? true : false,
              chosenTags: user.tagsUsers.length ? true : false,
              isAdmin: user.admin,
            };
            dispatch({ type: ACTIONS.RESTORE_TOKEN, data: data });
          }
        } catch (error) {
          //if the problem came from the server, then the token is invalid (or the route address is wrong)
          if (axios.isAxiosError(error)) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              const axiosError = error as AxiosError;
              console.log("token invalid:", axiosError.response?.data);
              try {
                //delete the corrupt token (mind you that axios will still send requests using the bad token. but then again, who cares?)
                await deleteItemAsync("TILK-token");
                //get out of the loading phase, as a guest
                dispatch({ type: ACTIONS.SIGN_OUT });
              } catch (deleteError) {
                console.log(
                  "problem occurred while deleting token",
                  deleteError
                );
              }
            }
            if (error.request) {
              // The request was made but no response was received
              console.error(
                "No response received from the server:",
                error.request
              );
            }
          } else {
            //this is not an axios related error
            console.log("Restoring token failed for some reason:", error);
          }
        }
      };

      getTokenAsync();
    }, []);
  }
}

// Custom hooks to use auth state and dispatch

/*

Now, in your components, you can use these contexts like this:
javascript
function SomeComponent() {
  const { userToken, userId } = useAuthState();
  const { signOut } = useAuthDispatch();

  // Use userToken, userId, and signOut as needed
}


*/

export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }
  return context;
}
