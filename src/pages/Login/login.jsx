import React, { useState, useEffect } from 'react'
import './loginstyle.css'

import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { app } from '../../firebaseConfig.js'

import toast, { Toaster } from 'react-hot-toast';
import LoginBackground from '../../components/ui/login-background.jsx';

import { getAuth, createUserWithEmailAndPassword, sendEmailVerification,signInWithEmailAndPassword,  signInWithRedirect, getRedirectResult ,
GoogleAuthProvider} from "firebase/auth";

import { googleProvider, auth, db } from '../../firebaseConfig.js';

import { useNavigate } from 'react-router-dom';





const Login = () => {

    // useEffect(() => {
    //     // Set styles when component mounts
    //     document.body.style.margin = '0';
    //     document.body.style.padding = '0';
    //     document.body.style.boxSizing = 'border-box';
    //     document.body.style.backgroundColor = 'black';
    //     document.body.style.overflow = 'hidden';
    //     // Other styles...
    
    //     // Revert styles when component unmounts
    //     return () => {
    //         document.body.style.backgroundColor = '';
    //         document.body.style.overflow = '';

    //     };
    // }, []);



    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '',email: '', password: '', confirmPassword: ''});
    const [errors, setErrors] = useState
    ({});

    

    const handleSignUpClick = (e) => {
        e.preventDefault();
        setIsActive(true);
    };

    const handleSignInClick = (e) => {
        e.preventDefault();
        setIsActive(false);
    };

    const handleLoginInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };
    
    const handleRegisterInputChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };


    const validateLogin = () => {
        let isValid = true;
        let errors = {};
    
        // Email validation
        if (!loginData.email) {
            // errors.email = 'Email is required';
            toast.error('Email is required');
            isValid = false;
        }
    
        // Password validation
        if (!loginData.password) {
            // errors.password = 'Password is required';
            toast.error('Password is required');
            isValid = false;
        }
    
        setErrors(errors);
        return isValid;
    };
    
    const validateRegister = () => {
        let isValid = true;
        let errors = {};
        
        // Name validation
        if (!registerData.name) {
            // errors.name = 'Name is required';
            toast.error('Name is required');
            isValid = false;
        }
        // Email validation
        if (!registerData.email) {
            // errors.email = 'Email is required';
            toast.error('Email is required');
            isValid = false;
        }
    
        // Password validation
        if (!registerData.password) {
            // errors.password = 'Password is required';
            toast.error('Password is required');
            isValid = false;
        } 
        else if (registerData.password !== registerData.confirmPassword) {
            // errors.confirmPassword = 'Passwords do not match';
            toast.error('Passwords do not match');
            isValid = false;
        }
    
        setErrors(errors);
        return isValid;
    };
    


    const handleLoginSubmit = (e) => {

        e.preventDefault();
        if (validateLogin()) {
            const email = loginData.email;
            const password = loginData.password;

            
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
                toast.success('Logged in successfully');
                setTimeout(() => {
                handleSignInSuccess();
                }, 2000);
                const user = userCredential.user;
                console.log(user);
            // ...
            })
            .catch((error) => {
                const errorCode = error.code;

                const errorMessage = error.message;
            });
        }
    };
    

    const handleSignInSuccess = () => {
        navigate('/dashboard');
    }

    const addUserInDatabase = (user, name, email) => {
        if (user && user.uid) {

            set(ref(db, 'Users/' + user.uid), {
                Name: name,
                email: email,
                Tiles: {} // Initialize 'tiles' as an empty object
            })
            .then(() => {
                console.log('User added/updated in database');
            })
            .catch((error) => {
                toast.error('Error adding user to database:', error);
            });

            
        } else {
            toast.error('User is not defined or authenticated');
        }
    };
    
    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (validateRegister()) {
            const name = registerData.name;
            const email = registerData.email;
            const password = registerData.password;
            
            toast('Registering...');

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                // Signed in
                toast.success('Created and Authenticated User');
                const user = userCredential.user;
                // Add user to the database
                addUserInDatabase(user, name, email);
                return user; // Return the user for the next then block
                })
                .then((user) => {
                // User added to the database successfully
                toast.success('User has been registered successfully!');
                // Navigate to the Dash component or perform other actions
                })
                .catch((error) => {
              // Handle errors here
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    toast.error('Email already in use. Please try another email.');
                } else {
                    toast.error(errorMessage);
                }
              // Assuming `setErrors` is a function to update the local state with errors
                setErrors((prevErrors) => ({ ...prevErrors, register: errorMessage }));
                });
        }
    };

    const handleGoogleSignIn = () => {
        signInWithRedirect(auth, googleProvider); // This initiates the sign-in flow
    };
        useEffect(() => {
            getRedirectResult(auth)
            .then((result) => {
                if (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                
                    const user = result.user;
                    
                    toast.success('Logged in successfully');
                    console.log(user.displayName);
                    addUserInDatabase(user, user.displayName, user.email);
                    setTimeout(() => {
                        handleSignInSuccess();
                        }, 
                    2000);
                }
            })
            .catch((error) => {
            // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
        }, [auth]);

        




    return (
        
        <div className='login-style'>
        <LoginBackground/>
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    // Define default options
                    className: '',
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },

                    // Default options for specific types
                    success: {
                        duration: 5000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
            
            <div className='container'>
                <div className="content">
                    <h2 className="logo">TabenSpace</h2>
                    <div className="text-sci">
                        <h2>Welcome to TabenSpace </h2>
                        <h3>Sign In to Continue</h3>
                    </div>
                </div>

                <div className={`logreg-box ${isActive ? 'active' : ''}`}>
                    <div className="form-box login">
                        <form onSubmit={handleLoginSubmit} noValidate>
                            <h2>Sign In</h2>
                            
                            <div className="input-container">

                            <div class="flex flex-col">
                            <span class="text-white/70 font-sans text-[20px] my-1">Email</span>
                            <input
                                placeholder="Enter your email..."
                                class="px-3 w-[260px] text-[18px] bg-[#171616] bg-opacity-0 text-white p-2 rounded-md border outline-none ring-2 ring-blue-500/0 focus:ring-grey-500"
                                name="email"
                                type="email"
                                value={loginData.email}
                                onChange={handleLoginInputChange}/>
                            </div>

                            <div class="flex flex-col">
                            <span class="text-white/70 font-sans text-[20px] my-1">Password</span>
                            <input
                                placeholder="Enter your password..."
                                class="px-3 w-[260px] text-[18px] bg-[#171616] bg-opacity-0 text-white p-2 rounded-md border outline-none ring-2 ring-blue-500/0 focus:ring-grey-500"
                                name="password"
                                type="password"
                                value={loginData.password}
                                onChange={handleLoginInputChange}/>
                            </div>
                            </div>


                            <div className="remember-forgot">
                                <label>
                                <input 
                                    type="checkbox" 
                                    name='rememberLogIn' />
                                    Remember me</label>
                                <a href="#">Forgot password?</a>
                            </div>

                            <div className="btn-container">
                                <button type="submit" className="btn">LOG IN</button>
                            </div>

                            
                            
                            <div className="login-register">
                                <p>
                                    Don't have an account?{' '}
                                    <button 
                                        onClick={handleSignUpClick} 
                                        className="register-link">
                                    Sign up</button>
                                </p>
                            </div>
                            <div className="gsi-button">
                                    <button className="gsi-material-button"
                                    onClick={handleGoogleSignIn}>
                                    <div className="gsi-material-button-state" />
                                    <div className="gsi-material-button-content-wrapper">
                                        <span className="gsi-material-button-contents"> Sign in using </span>
                                        <div className="gsi-material-button-icon">
                                            <svg
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 48 48"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                style={{ display: "block" }}>
                                                <path
                                                fill="#EA4335"
                                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>

                                                <path
                                                fill="#4285F4"
                                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>

                                                <path
                                                fill="#FBBC05"
                                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                                <path
                                                fill="#34A853"
                                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                                <path fill="none" d="M0 0h48v48H0z" />
                                            </svg>
                                        </div>
                                        
                                        <span style={{ display: "none" }}>Sign in with Google</span>
                                    </div>
                                    </button>
                                </div>  

                        </form>
                    </div>

                    <div className="form-box register">
                        <form onSubmit={handleRegisterSubmit} noValidate>
                            <h2>Sign up</h2>

                                
                                <div class="flex flex-col">
                                <span class="text-white/70 font-sans text-[20px] my-1">Name</span>
                                <input
                                    placeholder="Enter your name..."
                                    class="px-3 w-[260px] text-[18px] bg-[#171616] bg-opacity-0 text-white p-2 rounded-md border outline-none ring-2 ring-blue-500/0 focus:ring-grey-500"
                                    name="name"
                                    type="text"
                                    value={registerData.name}
                                    onChange={handleRegisterInputChange}/>
                                </div>

                                
                                <div class="flex flex-col">
                                <span class="text-white/70 font-sans text-[20px] my-1">Email</span>
                                <input
                                    placeholder="Enter your email..."
                                    class="px-3 w-[260px] text-[18px] bg-[#171616] bg-opacity-0 text-white p-2 rounded-md border outline-none ring-2 ring-blue-500/0 focus:ring-grey-500"
                                    name="email"
                                    type="email"
                                    value={registerData.email}
                                    onChange={handleRegisterInputChange}/>
                                </div>


                                <div class="flex flex-col">
                                <span class="text-white/70 font-sans text-[20px] my-1">Password</span>
                                <input
                                    placeholder="Enter your password..."
                                    class="px-3 w-[260px] text-[18px] bg-[#171616] bg-opacity-0 text-white p-2 rounded-md border outline-none ring-2 ring-blue-500/0 focus:ring-grey-500"
                                    name="password"
                                    type="password"
                                    value={registerData.password}
                                    onChange={handleRegisterInputChange}/>
                                </div>

                                
                                <div class="flex flex-col my-1">
                                
                                <input
                                    placeholder="Confirm your password..."
                                    class="px-3 w-[260px] text-[18px] bg-[#171616] bg-opacity-0 text-white p-2 rounded-md border outline-none ring-2 ring-blue-500/0 focus:ring-grey-500"
                                    name="confirmPassword"
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={handleRegisterInputChange}/>
                                </div>
                                
                                {/* <div className="remember-forgot">
                                    <label>
                                    <input 
                                        type="checkbox" 
                                        required />
                                        I agree to the terms & conditions</label>                      
                                </div> */}

                                <div className="btn-container">
                                    <button 
                                        type="submit" 
                                        className="btn">
                                        Register</button>
                                </div>
                                
                                <div className="login-register">
                                    <p>
                                        Already have an account?{' '}
                                        <button onClick={handleSignInClick} className="login-link">
                                        Sign in
                                        </button>
                                    </p>
                                </div>
                                
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login
