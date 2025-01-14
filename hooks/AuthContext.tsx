// "use client"
// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import Cookies from 'js-cookie';

// interface AuthContextType {
//   isLoggedin: boolean;
//   setIsLoggedin: (value: boolean) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoggedin, setIsLoggedin] = useState<boolean>(!!Cookies.get('isLoggedin'));

//   useEffect(() => {
//     const checkLoginStatus = () => {
//       setIsLoggedin(!!Cookies.get('isLoggedin'));
//     };

//     window.addEventListener("loginStatusUpdated", checkLoginStatus);
//     return () => window.removeEventListener("loginStatusUpdated", checkLoginStatus);
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isLoggedin, setIsLoggedin }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
