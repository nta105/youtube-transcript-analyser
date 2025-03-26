import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

interface AuthButtonProps {
  isLoggedIn: boolean;
  userEmail: string | null;
}

const AuthButton: React.FC<AuthButtonProps> = ({ isLoggedIn, userEmail }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center">
      {isLoggedIn ? (
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-300">{userEmail}</span>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-3 py-1 text-sm text-white bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Sign Out'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Sign In with Google'}
        </button>
      )}
    </div>
  );
};

export default AuthButton; 