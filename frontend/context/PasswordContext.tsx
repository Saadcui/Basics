import React, { createContext, ReactNode, useContext, useState } from "react";


export type PasswordEntry = {
  description: string; 
  password: string;    
};

type PasswordContextType = {
  passwords: PasswordEntry[];
  addPassword: (entry: PasswordEntry) => void;
  removePassword: (index: number) => void; 
};

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export const PasswordProvider = ({ children }: { children: ReactNode }) => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);

  const addPassword = (entry: PasswordEntry) => {
    setPasswords((prev) => [...prev, entry]);
  };
 const removePassword = (index: number) => {
    setPasswords((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <PasswordContext.Provider value={{ passwords, addPassword, removePassword }}>
      {children}
    </PasswordContext.Provider>
  );
};

export const usePasswords = () => {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error("usePasswords must be used within a PasswordProvider");
  }
  return context;
};
