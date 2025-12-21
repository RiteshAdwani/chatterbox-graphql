import { Navigate } from 'react-router-dom';
import { getLocalStorageData } from '../utils/localStorage';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorageKeys';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * HOC for protecting routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const accessToken = getLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
