import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth";

function AuthRouter({ children }) {
  const context = useContext(AuthContext);

  return (
    context.user ? <Navigate to="/" /> : children
    // <Route
    //   {...rest}
    //   render={(props) =>
    //     context.user ? <Navigate to="/" /> : <Component {...props} />
    //   }
    // />
  );
}

export default AuthRouter;
