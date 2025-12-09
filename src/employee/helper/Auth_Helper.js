import { getSessionData } from "./My_Helper"; 
import { Navigate } from 'react-router-dom';
import config from "../config/Config";
const SESSIONKEY = config.SESSIONKEY;
const ProtectedRoute = ({ children }) => {
    let data = getSessionData(SESSIONKEY);
  
    if (!data) {
      return <Navigate to="/" replace />;
    }
    return children;
};

export {ProtectedRoute };
 