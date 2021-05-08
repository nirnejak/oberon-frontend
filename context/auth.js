import React from "react"

import { useRouter } from "next/router"

import NProgress from "nprogress"
import PropTypes from "prop-types"

import { accountRegister, tokenCreate } from "../graphql/user"

const initialState = {
  error: {},
  isAuthenticated: false,
  isLoading: false,
  user: {
    avatar: {},
    firstName: "",
    id: "",
    isLoggedIn: false,
    lastName: "",
    token: "",
    username: "",
  },
}

export const AuthContext = React.createContext(initialState)

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADER":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case "CONTINUE_SESSION":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      }
    case "LOGIN_USER":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
      }
    case "LOGOUT_USER":
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: {},
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(AuthReducer, initialState)
  const router = useRouter()

  // function handleError(error) {
  //   // showErrorToast(error)
  //   dispatch({
  //     payload: error,
  //     type: "SET_ERROR",
  //   })
  // }

  function setLoader(isLoading) {
    dispatch({ payload: isLoading, type: "SET_LOADER" })
  }

  function continueSession(user) {
    dispatch({ payload: user, type: "LOGIN_USER" })
  }

  function loginUser(user) {
    dispatch({ payload: true, type: "SET_LOADER" })
    NProgress.start()

    tokenCreate(user)
      .then((res) => {
        NProgress.done()
        const { tokenCreate } = res

        if (tokenCreate.token) {
          localStorage.setItem("csrfToken", tokenCreate.csrfToken)
          localStorage.setItem("email", tokenCreate.user.email)
          localStorage.setItem("refreshToken", tokenCreate.refreshToken)
          localStorage.setItem("token", tokenCreate.token)

          const userInformation = {
            csrfToken: tokenCreate.csrfToken,
            email: tokenCreate.user.email,
            refreshToken: tokenCreate.refreshToken,
            token: tokenCreate.token,
          }

          dispatch({ payload: userInformation, type: "LOGIN_USER" })
          router.push("/")
        } else {
          console.log(tokenCreate.accountErrors)
        }
      })
      .catch((error) => {
        NProgress.done()
        console.log(error)
      })
  }

  function registerUser(user) {
    dispatch({ payload: true, type: "SET_LOADER" })
    NProgress.start()

    accountRegister(user)
      .then((res) => loginUser(user))
      .catch((error) => {
        NProgress.done()
        console.log(error)
      })
  }

  function logoutUser() {
    // removeAuthToken()
    dispatch({ type: "LOGOUT_USER" })
    localStorage.clear()
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        continueSession,
        error: state.error,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        loginUser,
        logoutUser,
        registerUser,
        setLoader,
        user: state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
