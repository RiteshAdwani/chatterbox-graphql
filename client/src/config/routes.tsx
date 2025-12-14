import type { ReactNode } from 'react';
import { Login } from '../pages/Login/Login';
import { Signup } from '../pages/Signup/Signup';
import { Home } from '../pages/Home/Home';
import { Chats } from '../pages/Chats/Chats';

export interface RouteConfig {
  path: string;
  component: () => ReactNode;
  isPrivate: boolean;
  title?: string;
}

/**
 * Application routes configuration
 * isPrivate: true - requires authentication
 * isPrivate: false - public route (redirects if authenticated)
 */
export const routes: RouteConfig[] = [
  // Public routes
  {
    path: '/login',
    component: Login,
    isPrivate: false,
    title: 'Login',
  },
  {
    path: '/signup',
    component: Signup,
    isPrivate: false,
    title: 'Sign Up',
  },
  
  // Private routes
  {
    path: '/',
    component: Home,
    isPrivate: true,
    title: 'Home',
  },
  {
    path: '/chats',
    component: Chats,
    isPrivate: true,
    title: 'Chats',
  },
];

// Route paths for easy reference
export const ROUTE_PATHS = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  HOME: '/',
  CHATS: '/chats',
} as const;
