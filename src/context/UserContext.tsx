"use client";

import { createContext, useContext } from "react";

export const UserContext = createContext<any>(null);

export const useUserContext = () => {
  return useContext(UserContext);
};