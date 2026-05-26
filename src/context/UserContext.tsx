"use client";

import { createContext, useContext } from "react";

export type UserContextType = {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
  validateUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  clearUser: () => {},
  validateUser: async () => {},
});

export const useUserContext = () => {
  return useContext(UserContext);
};