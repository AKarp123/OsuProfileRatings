import { Link } from "react-router-dom";
import { Container, Grid, Typography, Button, Paper, TextField} from "@mui/material";
import User from "../Providers/User";
import { useContext } from "react";

const Home = () => {
    const userContext = useContext(User);

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="center" sx={{mt: "12.5vw"}}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={1} sx={{padding: "100px", alignItems: "center", justifyContent: "center", borderRadius: "20px"}}>
                        <Typography variant="h3" align="center" sx={{mb: "30px"}}>
                            Osu Profile Ratings
                        </Typography>

                        <Typography variant="h5" align="center" paragraph>
                            {userContext.user ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="/profile"
                                >
                                    Profile   
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to="http://localhost:3000/login"
                                >
                                    Login with osu
                                </Button>
                            )}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const ProfileSearch = () => {


    return (



        <p>
            te
        </p>
    )




}

export default Home;
