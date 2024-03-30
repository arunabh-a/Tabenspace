import React, { useState, useEffect } from 'react'
import './loginstyle.css'
import './background.js'
import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { app } from '../../firebaseConfig.js'
import toast, { Toaster } from 'react-hot-toast';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification,signInWithEmailAndPassword,  signInWithRedirect, getRedirectResult ,
GoogleAuthProvider} from "firebase/auth";
import { googleProvider, auth, db } from '../../firebaseConfig.js';
import { useNavigate } from 'react-router-dom';



const Login = () => {

    useEffect(() => {
        // Set styles when component mounts
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.boxSizing = 'border-box';
        document.body.style.backgroundColor = 'black';
        document.body.style.overflow = 'hidden';
        // Other styles...
    
        // Revert styles when component unmounts
        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.overflow = '';

        };
    }, []);



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
            <div className="background">
            <canvas id="canvas">Your browser doesn't support canvas</canvas>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="shadowed-goo">
                        
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
                        <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2" result="shadow" />
                        <feOffset in="shadow" dx="1" dy="1" result="shadow" />
                        <feBlend in2="shadow" in="goo" result="goo" />
                        <feBlend in2="goo" in="SourceGraphic" result="mix" />
                    </filter>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feBlend in2="goo" in="SourceGraphic" result="mix" />
                    </filter>
                </defs>
            </svg>
            <script src="background.js"></script>
            </div>
            
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
                        <h2>Welcome to TabenSpace <br />  Sign In to Access your Account </h2>
                        <h3>Check our Socials</h3>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/arunabhaa">
                            <svg xmlns='http://www.w3.org/2000/svg' width='40px' height='40px' viewBox="0 0 24 24"><title>social_x_line</title><g id="social_x_line" fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0h24ZM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01-.184-.092Z'/><path fill='#FFFFFFFF' d='M19.753 4.659a1 1 0 0 0-1.506-1.317l-5.11 5.84L8.8 3.4A1 1 0 0 0 8 3H4a1 1 0 0 0-.8 1.6l6.437 8.582-5.39 6.16a1 1 0 0 0 1.506 1.317l5.11-5.841L15.2 20.6a1 1 0 0 0 .8.4h4a1 1 0 0 0 .8-1.6l-6.437-8.582 5.39-6.16ZM16.5 19 6 5h1.5L18 19h-1.5Z'/></g></svg>
                            </a>
                            <a href="#">
                            <svg xmlns='http://www.w3.org/2000/svg' width='40px' height='40px' viewBox="0 0 24 24"><title>ins_line</title><g id="ins_line" fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/><path fill='#FFFFFFFF' d='M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8Zm0 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm-4 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm4.5-3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z'/></g></svg>
                            </a>
                            <a href="#">
                            <svg xmlns='http://www.w3.org/2000/svg' width='40px' height='40px' viewBox="0 0 24 24"><title>linkedin_fill</title><g id="linkedin_fill" fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/><path fill='#FFFFFFFF' d='M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12ZM8 10a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-5a1 1 0 0 0-1-1Zm3-1a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-3.66c.305-.344.82-.748 1.393-.993.333-.142.834-.2 1.182-.09.152.048.24.116.293.188.052.07.132.226.132.555v4a1 1 0 0 0 2 0v-4c0-.67-.17-1.266-.524-1.744a2.54 2.54 0 0 0-1.301-.907c-.902-.283-1.901-.126-2.568.16a5.82 5.82 0 0 0-.623.312A1 1 0 0 0 11 9ZM8 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z'/></g></svg>
                            </a>
                        </div>  
                    </div>
                </div>

                <div className={`logreg-box ${isActive ? 'active' : ''}`}>
                    <div className="form-box login">
                        <form onSubmit={handleLoginSubmit} noValidate>
                            <h2>Sign In</h2>
                            
                            <div className="input-box">
                                <span className="icon"><i className='bx bxs-envelope' ></i></span>
                                <input 
                                    type="email" 
                                    name='email' 
                                    value={loginData.email} 
                                    onChange={handleLoginInputChange} 
                                    required />
                                <label >Email</label>
                                {errors.email && <p className="error">{errors.email}</p>}
                            </div>

                            <div className="input-box">
                                <span className="icon"><i className='bx bxs-lock-alt' ></i></span>
                                <input 
                                    type="password" 
                                    name='password' 
                                    value={loginData.password} 
                                    onChange={handleLoginInputChange} 
                                    required />
                                <label >Password</label>
                                {errors.password && <p className="error">{errors.password}</p>}
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

                                <div className="input-box">
                                    <span className="icon"><i className='bx bxs-user' ></i></span>
                                    <input 
                                        type="text" 
                                        name='name' 
                                        value={registerData.name}
                                        onChange={handleRegisterInputChange}
                                        required />
                                        {errors.name && <p className="error">{errors.name}</p>}
                                    <label >Name</label>

                                </div>

                                <div className="input-box">
                                    <span className="icon"><i className='bx bxs-envelope' ></i></span>
                                    <input 
                                        type="email" 
                                        name='email'
                                        value={registerData.email}
                                        onChange={handleRegisterInputChange}
                                        required />
                                    <label>Email</label>
                                    {errors.email && <p className="error">{errors.email}</p>}
                                </div>

                                <div className="input-box">
                                    <span className="icon"><i className='bx bxs-lock-alt' ></i></span>
                                    <input 
                                        type="password" 
                                        name='password'
                                        value={registerData.password}
                                        onChange={handleRegisterInputChange}
                                        required />
                                    <label >Password</label>
                                    {errors.password && <p className="error">{errors.password}</p>}
                                </div>

                                <div className="input-box">
                                    <span className="icon"><i className='bx bxs-lock-alt' ></i></span>
                                    <input 
                                        type="password" 
                                        name='confirmPassword'
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterInputChange}
                                        required />
                                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                                    <label >Confirm Password</label>
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