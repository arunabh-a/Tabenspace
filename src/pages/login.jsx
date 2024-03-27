import React, {useState} from 'react'
import './assets/loginstyle.css'
import './assets/background.js'
import { getDatabase, ref, onValue, set } from "firebase/database";
import { app } from '../firebaseConfig'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import toast, { Toaster } from 'react-hot-toast';


const Login = () => {
    const [isActive, setIsActive] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '',email: '', password: '', confirmPassword: ''});
    const [errors, setErrors] = useState
    ({});

    const db = getDatabase(app);

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
    

    const auth = getAuth();

    const handleLoginSubmit = (e) => {

        e.preventDefault();
        if (validateLogin()) {
            const email = loginData.email;
            const password = loginData.password;

            
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
                toast.success('Logged in successfully');
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
    
    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (validateRegister()) {
            const name = registerData.name;
            const email = registerData.email;
            const password = registerData.password;


            Promise.resolve()
            .then(() => {
              toast('Registering...');
              return createUserWithEmailAndPassword(auth, email, password);
            })
            .then((userCredential) => {
              // Signed in
              toast.success('Created and Authenticated User');
              const user = userCredential.user;
              // console.log(user);
              return set(ref(db, 'Users/' + user.uid), {
                name: name,
                email: email,
                tiles: '{}' // Initialize 'tiles' as an empty object
              });
            })
            .then(() => {
              // Data saved successfully
              toast.success('User has been registered successfully!');
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
              setErrors({ ...errors, register: errorMessage });
            });
        }
      };

    //         createUserWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             // Signed in 
                
    //             const user = userCredential.user;
    //             toast.success('User Authenticated');
    //             // console.log(user);

    //             set(ref(db, 'Users/' + user.uid), {
    //                 name: name,
    //                 email: email,
    //                 tiles: '{}' // Initialize 'tiles' as an empty object
    //             }).then(() => {
    //                 // Data saved successfully
    //                     toast.success('User has been Registered Successfully!');
    //             }).catch((error) => {
    //                 // Handle errors here
    //                     console.error('Error saving user data:', error);
    //             });


    //         })
    //         .catch((error) => {
    //             const errorCode = error.code;
    //             const errorMessage = error.message;
    //             toast.error('Error creating user:', errorCode, errorMessage);
    //             setErrors({ ...errors, register: errorMessage });
    //         });
    //     }
    // };





    return (
        <div>
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
                        duration: 3000,
                        theme: {
                            primary: 'green',
                            secondary: 'black',
                        },
                    },
                }}
            />
            
            <div className="container">
                <div className="content">
                    <h2 className="logo">TabenSpace</h2>
                    <div className="text-sci">
                        <h2>Welcome to TabenSpace <br />  Sign In to Access your Account </h2>
                        <h3>Check our Socials</h3>
                        <div className="social-icons">
                            <a href="https://www.linkedin.com/in/arunabhaa"><i className='bx bxl-linkedin'></i></a>
                            <a href="#"><i className='bx bxl-instagram'></i></a>
                            <a href="#"><i className='bx bxl-twitter'></i></a>
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
                                    <button className="gsi-material-button">
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