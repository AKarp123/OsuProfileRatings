import "./App.css";
import { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import axios from "axios";
import User from "./Providers/User";


function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        axios.get("/api/getUserData", ).then((res) => {
            if (res.data.success === false) {
                console.log(res.data.message);
                return;
            }
            if(res.data.user !== null) {
                setUser(res.data.user);
            
                setIsLoggedIn(true);
            }
        })
        .catch((err) => {
            console.log("Can't connect to server. Try again later.")
        });
    }, []);

    return (
        <User.Provider value={{
            user,
            isLoggedIn,
            logOut: () => {
                axios.get("/api/logout").then((res) => {
                    if (res.data.success) {
                        setUser(null);
                        setIsLoggedIn(false);
                    } 
                    
                });
            },
        }}>
            <Routes>
                <Route path="/" element={<Home loggedIn={isLoggedIn} />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/profile/:id" element={<Profile user={user} />} />
            </Routes>
        </User.Provider>
    );
}

export default App;
