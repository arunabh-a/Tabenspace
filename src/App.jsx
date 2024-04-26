import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dash from './pages/Dashboard/dash';
import Login from './pages/Login/login';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Preloader from './components/preloader';


function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Preloader loading={loading} loadCaption='Checking User Details....' />; // Or your loading component
    }




    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/auth" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/dashboard" element={currentUser ? <Dash /> : <Navigate to="/auth" />} />
                    

                    <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/auth" />} />
                </Routes>
            </Router>

        </div>
    )
    }

export default App
