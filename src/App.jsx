import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dash from './pages/Dashboard/dash';
import Login from './pages/Login/login';


function App() {




    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dash />} />
                    {/* Redirect to login by default */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>

        </div>
    )
    }

export default App
