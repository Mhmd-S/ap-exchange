import {createContext, useContext, useEffect, useState} from 'react';
import { auth } from './firebase';
import { addUser, isAdmin } from './firestore';
import { onAuthStateChanged, signOut as authSignOut , createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification} from 'firebase/auth';
    
const AuthUserContext = createContext({
    uid: null,
    isLoading: true
});

export default function useFirebaseAuth() {

    const [authUser, setAuthUser] = useState(null);
    const [userAdmin, setUserAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [signUpErrors, setSignUpErrors] = useState(null);
    const [logInErrors, setLoginErrors] = useState(null);
    const [resetError, setResetErrors] = useState(null);

    // const clear = () => {
    //     setAuthUser(null);
    //     setIsLoading(false);
    // }
    
    // const clearErrors = () => {
    //     setSignUpErrors(null);
    //     setLoginErrors(null);
    //     setResetErrors(null);
    // }

    const authStateChange = async(user) => {
        if (!user){
            setAuthUser(null);
            setIsLoading(false);
            return;
        }

        if (!user.emailVerified) { // If user is not verified we are going to sign them out and display an warning.
            await signOut();
            setAuthUser(null);
            setLoginErrors("Please verify your email.");
            return;
        }
        
        const admin = await isAdmin(user.uid);
        setUserAdmin(admin);

        setAuthUser({
            uid: user.uid,
            email: user.email,          
        });
        
        setSignUpErrors(null);
        setLoginErrors(null);
        setResetErrors(null);
        setIsLoading(false);
    }

    const signUp = async(email, password) => {
        try {
            setSignUpErrors(null);
            setIsLoading(true);
    
            const currentUser = await createUserWithEmailAndPassword(auth, email, password);
            setSignUpErrors('none');
            
            await sendEmailVerification(currentUser.user);

            await addUser(currentUser.user.uid, email);

            signOut();
            setLoginErrors('Please check your email for the verification link.');
            setIsLoading(false);
        } catch (e) {
            if (e.code == 'auth/email-already-in-use') {
                setSignUpErrors('Email already in use');
            } else if (e.code == 'auth/email-already-exists') {
                setSignUpErrors('Email not unique');
            } else  {
                setSignUpErrors('An error has occurred. Try again later.');
            }
            setIsLoading(false);
        }
    };

    const signOut = async() => {
        try{
            await authSignOut(auth);
            setAuthUser(null);
        }catch(e){
            console.log(e);
        }
    }

    const signIn = async(email, password) => {
        setLoginErrors(null);
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);            
        } catch (e) {
            if (e.code == 'auth/user-not-found'){
              setLoginErrors("Invalid User.");
            } else if (e.code == 'auth/wrong-password') {
              setLoginErrors("Wrong password.");
            } else {
              setLoginErrors("An error has occured. Try again later.");
            }
          }
        
          setIsLoading(false);
    }

    

    const resetPassword = (email) => {
        setIsLoading(true);
        setResetErrors(null);

        sendPasswordResetEmail(auth, email)
        .then(()=>{
            setResetErrors('none');
        }).catch((e)=>{
            if(e.code == 'auth/user-not-found') {
                setResetErrors('User not found');
            } else {
                setResetErrors('An error has occured. Try again later.')
            }
        });

        setIsLoading(false);
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, authStateChange);
        return ()=> unsubscribe(); 
    },[])

    return {
        authUser,
        userAdmin,
        isLoading,
        signUpErrors,
        logInErrors,
        resetError,
        resetPassword,
        signUp,
        signIn,
        signOut
    };
}

export const AuthUserProvider = ({ children }) => {
    const auth = useFirebaseAuth();
    return (<AuthUserContext.Provider value={auth}>
                {children}
            </AuthUserContext.Provider>);
}

export const useAuth = () => {return useContext(AuthUserContext)};
