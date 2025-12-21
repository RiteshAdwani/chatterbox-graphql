import { Navigate } from 'react-router-dom';
import { getLocalStorageData } from '../utils/localStorage';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorageKeys';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * HOC for public routes like login/signup
 * Redirects to home if user is already authenticated
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const accessToken = getLocalStorageData(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
