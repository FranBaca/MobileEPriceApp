import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ENV from "../env";

const CLIENT_ID = ENV.ML_CLIENT_ID;
const CLIENT_SECRET = ENV.ML_CLIENT_SECRET;
const API_BASE_URL = ENV.API_URL

interface AuthContextType {
  accessToken: string;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const checkAndFetchToken = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}/auth/mercadolibre`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              grant_type: "client_credentials",
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
            }),
          });

          const data = await response.json();

          await AsyncStorage.setItem('access_token', data.access_token);
          setAccessToken(data.access_token); 
      } catch (error) {
        console.error("❌ Error obteniendo App Token:", error);
      }
    };

    checkAndFetchToken();
  }, []);

  const refreshToken = async () => {
    await AsyncStorage.removeItem("access_token");
    setAccessToken("");
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};