'use client' 
// the line above ensures that next doesn't prebuild the page on the server side
import { auth, db, githubProvider, googleProvider } from "@/firebase"
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { deleteDoc, doc, getDoc, setDoc, } from "firebase/firestore"
import React, {useContext, useState, useEffect} from "react"
// import { getErrorMessage } from "@/utils/error"


const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userDataObj, setUserDataObj] = useState(null)
  const [loading, setLoading] = useState(true)

  // AUTH HANDLERS
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider)

      const userRef = doc(db, 'users', result.user.uid);
      if (!(await getDoc(userRef)).exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          provider: 'google',
          createdAt: new Date().toISOString()
        });
      }
      return result;
    } catch(err) {
      console.log('Google sign-in error:', err); 
      throw new Error('Google sign-in error:', err)
    }
  }

  async function signInWithGithub() {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      // Create user document if new user
      const userRef = doc(db, 'users', result.user.uid);
      if (!(await getDoc(userRef)).exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email || `${result.user.uid}@github.com`,
          provider: 'github',
          createdAt: new Date().toISOString()
        });
      }
      return result;
    } catch (error) {
      console.error("GitHub sign-in error:", error);
      throw new Error("GitHub sign-in error:", error);
    }
  }

  async function signup(email, password) {
    try {
      const userDets = await createUserWithEmailAndPassword (auth, email, password)
      
      await setDoc(doc(db, 'users', userDets.user.uid), {
        email: userDets.user.email,
        uid: userDets.user.uid,
        createdAt: new Date().toISOString(),
        moods: {}
      })
      return userDets
    } catch(err) {
      const errorCode = err.code;
      if (errorCode === 'auth/email-already-in-use') {
        throw new Error('This email is already in use. Please use a different email.');
      } else if (errorCode === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please check your email and try again.');
      } else {
        throw new Error(err.message);
      }
    }
  }

  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch(err) {
      const errorCode = err.code;

      if (errorCode === 'auth/invalid-credential') {
        throw new Error('Invalid credentials. Please check your email or password.');  
      } else if (errorCode === 'auth/invalid-email') {
        throw new Error('Invalid email address. Please check your email and try again.');
      } else {
        throw new Error(err.message);
      }
    }
  }

  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return true
    } catch(err) {
      throw new Error('Reset password error:', err.message)
    }
  }

  function logout() {
    setUserDataObj(null)
    setCurrentUser(null)
    return signOut(auth)
  }

  async function deleteAccount() {
    try {
      if (!currentUser) {
        return
      }

      const userDocRef = doc(db, 'users', currentUser.uid)
      await deleteDoc(userDocRef)
      await deleteUser(currentUser)

      setUserDataObj(null);
      setCurrentUser(null);
    } catch(err) {
      console.error('Error deleting account:', err.message);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      try {
        // set the user to our local context state
        setLoading(true)
        setCurrentUser(user)
        if (!user) {
          return
        }

        // if user exists fetch data from firestore database
        // console.log('fetching user data')
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        let firebaseData = {}
        if (docSnap.exists()) {
          // console.log('found user data:')
          firebaseData = docSnap.data()
          // console.log('firebasedata:', firebaseData)
        }
        setUserDataObj(firebaseData)
      } catch(err) {
        // console.log(err.message)
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userDataObj,
    setUserDataObj,
    signInWithGoogle,
    signInWithGithub,
    signup,
    logout,
    login,
    resetPassword,
    deleteAccount,
    loading
  }

  return (
    <AuthContext.Provider value={value} >
      {children}
    </AuthContext.Provider>
  )
}