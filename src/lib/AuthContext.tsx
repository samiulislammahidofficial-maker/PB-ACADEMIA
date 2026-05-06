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

  // Inactivity timeout: 1 hour
  useEffect(() => {
    if (!user) return;

    const timeout = 3600000; // 1 hour in ms
    const checkInterval = 60000; // Check every minute
    let lastUpdate = Date.now();

    const updateActivity = () => {
      const now = Date.now();
      // Throttle updates to local storage to every 10 seconds
      if (now - lastUpdate > 10000) {
        lastUpdate = now;
        localStorage.setItem('pb_last_activity', now.toString());
      }
    };

    const handleInactivity = () => {
      const storedLast = localStorage.getItem('pb_last_activity');
      if (!storedLast) {
        localStorage.setItem('pb_last_activity', Date.now().toString());
        return;
      }
      
      const last = parseInt(storedLast);
      if (isNaN(last)) {
        localStorage.setItem('pb_last_activity', Date.now().toString());
        return;
      }

      if (Date.now() - last > timeout) {
        console.log("Session expired due to inactivity");
        logout();
      }
    };

    // Events to track activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, updateActivity, { passive: true }));

    localStorage.setItem('pb_last_activity', Date.now().toString());
    const interval = setInterval(handleInactivity, checkInterval);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [user]);

  // Persistence check for custom login - deprecated in favor of Firebase persistence
  useEffect(() => {
    const savedCustom = localStorage.getItem('pb_custom_auth');
    if (savedCustom) {
      // We still use this as a hint for initial load if Firebase is slow
      const data = JSON.parse(savedCustom);
      if (data.profile) setProfile(data.profile);
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
      
      // Save to users collection so rules can verify role
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...customProfile,
        identifier: identifier,
        isCustom: true,
        createdAt: new Date().toISOString()
      });

      setUser(firebaseUser);
      setProfile(customProfile);
      localStorage.setItem('pb_custom_auth', JSON.stringify({ role, identifier }));
    } catch (error: any) {
      console.error("Custom login failed:", error);
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('CONFIG_ERROR: Anonymous authentication is not enabled in the Firebase Console. Please enable it in the Authentication > Sign-in method tab.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setProfile(null);
    localStorage.removeItem('pb_custom_auth');
  };

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Only trigger loading if the user has actually changed and we need to fetch a new profile
      const userChanged = !user || !firebaseUser || user.uid !== firebaseUser.uid;
      
      setUser(firebaseUser);
      
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        if (userChanged) setLoading(true);
        unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), 
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error listening to profile:", error);
            setProfile(null);
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
