// context/UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface UserContextType {
  userRole: string | null;
  setUserRole: (role: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};
