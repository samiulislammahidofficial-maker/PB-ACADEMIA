import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, doc, getDoc, onSnapshot, setDoc } from './firebase';
import { User as FirebaseUser, signInAnonymously } from 'firebase/auth';

export type UserRole = 'student' | 'teacher' | 'admin';

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  schoolName?: string;
  mobileNumber?: string;
  className?: string; // mapping to 'class' since class is reserved
}

interface AuthContextType {
  user: FirebaseUser | null | any; // Any for custom admin/teacher objects
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  logout: () => Promise<void>;
  loginCustom: (role: 'admin' | 'teacher', identifier: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isTeacher: false,
  isStudent: false,
  logout: async () => {},
  loginCustom: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null | any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setProfile(null);
      localStorage.removeItem('pb_custom_auth');
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  // Skip inactivity check to avoid session instability
  
  // Custom auth hint for faster initial load
  useEffect(() => {
    const saved = localStorage.getItem('pb_custom_auth');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.profile) setProfile(data.profile);
      } catch (e) {}
    }
  }, []);

  const loginCustom = async (role: 'admin' | 'teacher', identifier: string) => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await signInAnonymously(auth);
      const customProfile: UserProfile = {
        uid: firebaseUser.uid,
        name: identifier === 'PB_ACADEMIA' ? 'PB Admin' : `Teacher ${identifier}`,
        email: identifier.includes('@') ? identifier : `${identifier}@pbacademia.internal`,
        role: role
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...customProfile,
        identifier: identifier,
        isCustom: true,
        createdAt: new Date().toISOString()
      });

      setUser(firebaseUser);
      setProfile(customProfile);
      localStorage.setItem('pb_custom_auth', JSON.stringify({ role, identifier, profile: customProfile }));
    } catch (error: any) {
      console.error("Custom login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        // Fetch real profile from Firestore
        unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), 
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              // Auto-promote this specific email to admin
              if (data.email === 'hasibhasan6678@gmail.com' && data.role !== 'admin') {
                setDoc(doc(db, 'users', firebaseUser.uid), { role: 'admin' }, { merge: true });
                data.role = 'admin';
              }
              setProfile(data);
              // Store hint for faster loading next time
              localStorage.setItem('pb_custom_auth', JSON.stringify({ profile: data }));
              setLoading(false);
            } else {
              // Doc specifically doesn't exist
              setProfile(null);
              setLoading(false);
            }
          },
          (error) => {
            console.error("Profile sync error:", error);
            // On error, we should still stop loading but maybe we don't have a profile
            setLoading(false);
          }
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isTeacher: profile?.role === 'teacher',
    isStudent: profile?.role === 'student',
    logout,
    loginCustom,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
