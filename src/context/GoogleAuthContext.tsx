import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, googleLogout, getAccessToken } from '../services/googleAuth';
import { exportToGoogleSheets, uploadPermitToGoogleDrive } from '../services/googleWorkspace';
import { InspectionRecord } from '../types/k3';

interface GoogleAuthContextType {
  currentUser: User | null;
  accessToken: string | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  syncToSheets: (records: InspectionRecord[], customTitle?: string) => Promise<{ spreadsheetUrl: string; rowCount: number }>;
  saveToDrive: (record: InspectionRecord) => Promise<{ webViewLink: string; fileName: string }>;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export const GoogleAuthProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setIsLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google Workspace Sign In error:', err);
      alert('Gagal menghubungkan Google Workspace: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await googleLogout();
      setCurrentUser(null);
      setAccessToken(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const syncToSheets = async (records: InspectionRecord[], customTitle?: string) => {
    let token = accessToken;
    if (!token) {
      const res = await googleSignIn();
      if (!res) throw new Error('Otorisasi Google diperlukan.');
      token = res.accessToken;
      setCurrentUser(res.user);
      setAccessToken(token);
    }

    const result = await exportToGoogleSheets(token, records, customTitle);
    return {
      spreadsheetUrl: result.spreadsheetUrl,
      rowCount: result.rowCount,
    };
  };

  const saveToDrive = async (record: InspectionRecord) => {
    let token = accessToken;
    if (!token) {
      const res = await googleSignIn();
      if (!res) throw new Error('Otorisasi Google diperlukan.');
      token = res.accessToken;
      setCurrentUser(res.user);
      setAccessToken(token);
    }

    const result = await uploadPermitToGoogleDrive(token, record);
    return {
      webViewLink: result.webViewLink,
      fileName: result.fileName,
    };
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        currentUser,
        accessToken,
        isLoading,
        signIn,
        signOut,
        syncToSheets,
        saveToDrive,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = (): GoogleAuthContextType => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProviderContext');
  }
  return context;
};
