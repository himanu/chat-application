import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { Bounce, toast } from "react-toastify";
import { LoaderContext } from "./LoaderContext";

export const AuthContext = createContext();

const toastConfigObj = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
}

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState("");
    const [isSignUp, setIsSignUp] = useState(true);
    const {toggleLoader} = useContext(LoaderContext);

    useEffect(() => {
      verfiyToken();
    }, []);

    const signOutUser = async() => {
      // ideally we should blacklist the token 
      localStorage.removeItem("token");
      setUser("");
    }

    const signUpUser = async ({email, name, password}) => {
      const response = await fetch(`signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            name
        })
      });
    
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message, toastConfigObj)
      } else {
        toast.success("Signed Up, please login now", toastConfigObj)
        setIsSignUp(false);
      }
    };

    const loginUser = async ({email, password}) => {
      const response = await fetch(`login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message, toastConfigObj);
      } else {
        toast.success("Sucessfully Logged In", toastConfigObj);
        localStorage.setItem("token", json.token);
        setUser(json.user);
      }
    }

    const verfiyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toggleLoader(false);
        setUser("");
        return;
      }
      const response = await fetch(`verfiy-token`, {
        headers: {
          'Authorization': token
        }
      });
      console.log(response);
      if (response.ok) {
        const json = await response.json();
        setUser(json.user);
      } else {
        localStorage.removeItem("token");
        setUser("");
      }
      toggleLoader(false);
    }
    return (
        <AuthContext.Provider
            value={{
                user,
                signOutUser,
                signUpUser,
                loginUser,
                isSignUp,
                setIsSignUp
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}