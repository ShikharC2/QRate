import { Navigate } from "react-router-dom";
import { app } from "../FirebaseConfig.js";
import { getAuth } from "firebase/auth";

function AuthHandler({ children }) {
    const auth = getAuth(app);
    if (auth.currentUser) {
        return children;           // user is logged in
    } else {
        return <Navigate to="/" />;  // user is NOT logged in
    }
}

export default AuthHandler;