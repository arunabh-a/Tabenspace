import React, {useState} from 'react'
import './assets/loginstyle.css'
import './assets/background.js'

const Login = () => {
    const [isActive, setIsActive] = useState(false);
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
                    <form action="/public/index.html">
                        <h2>Sign In</h2>
                        <div className="input-box">
                            <span className="icon"><i className='bx bxs-envelope' ></i></span>
                            <input type="email" required />
                            <label >Email</label>
                        </div>

                        <div className="input-box">
                            <span className="icon"><i className='bx bxs-lock-alt' ></i></span>
                            <input type="password" required />
                            <label >Password</label>
                        </div>

                        <div className="remember-forgot">
                            <label><input type="checkbox" />Remember me</label>
                            <a href="#">Forgot password?</a>
                        </div>

                        <div className="btn-container">
                            <button type="submit" className="btn">SUBMIT</button>
                        </div>
                        <div className="gsi-button">
                                <button className="gsi-material-button">
                                <div className="gsi-material-button-state" />
                                <div className="gsi-material-button-content-wrapper">
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
                                    <span className="gsi-material-button-contents">Sign in with Google</span>
                                    <span style={{ display: "none" }}>Sign in with Google</span>
                                </div>
                                </button>
                            </div>
                        <div className="login-register">
                            <p>
                                Don't have an account?{' '}
                                <button onClick={() => setIsActive(true)} className="register-link">
                                Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="form-box register">
                    <form action="/public/index.html">
                        <h2>Sign up</h2>
                            <div className="input-box">
                                <span className="icon"><i className='bx bxs-user' ></i></span>
                                <input type="text" required />
                                <label >Name</label>
                            </div>

                            <div className="input-box">
                                <span className="icon"><i className='bx bxs-envelope' ></i></span>
                                <input type="email" required />
                                <label>Email</label>
                            </div>

                            <div className="input-box">
                                <span className="icon"><i className='bx bxs-lock-alt' ></i></span>
                                <input type="password" required />
                                <label >Password</label>
                            </div>

                            <div className="remember-forgot">
                                <label><input type="checkbox" required />I agree to the terms & conditions</label>                      
                            </div>
                            <div className="btn-container">
                                <button type="submit" className="btn">SUBMIT</button>
                            </div>
                            
                            <div className="login-register">
                                <p>
                                    Already have an account?{' '}
                                    <button onClick={() => setIsActive(false)} className="login-link">
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