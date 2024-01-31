import "./App.css";
import { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile/Profile";
import axios from "axios";
import User from "./Providers/User";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./Components/Navbar";
import Loading from "./Components/Loading";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        // console.log("hello")
        axios
            .get("/api/getUserData")
            .then((res) => {
                if (res.data.success === false) {
                    console.log(res.data.message);
                    setLoading(false);
                    return;
                }
                if (res.data.user !== null) {
                    setUser(res.data.user);
                    setIsLoggedIn(true);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.log("Can't connect to server. Try again later.");
            });
    }, []);
    console.log(user);
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <User.Provider
                    value={{
                        user,
                        isLoggedIn,
                        logOut: () => {
                            axios.get("/api/logout").then((res) => {
                                if (res.data.success) {
                                    setUser(null);
                                    setIsLoggedIn(false);
                                    history.push("/");
                                }
                            });
                        },
                    }}
                >
                    <Navbar />
                    {loading ? (
                        <Loading />
                    ) : (
                        <Switch>
                            <Route path="/profile/:id" component={Profile} />
                            <Route path="/profile" component={Profile} />
                            <Route path="/" component={Home} />
                        </Switch>
                    )}
                </User.Provider>
            </ThemeProvider>
        </>
    );
}

export default App;
