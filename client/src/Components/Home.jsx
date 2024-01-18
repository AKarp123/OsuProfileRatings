import { Link } from "react-router-dom";
import { Container, Grid, Typography } from "@mui/material";

const Home = ({loggedIn}) => {
    return (
        <div>
            {!loggedIn ? <a href="http://localhost:3000/login">Login</a> : <Link to="/profile">Profile</Link> }
            
        </div>
    )
}

export default Home;