import { Link, useHistory } from "react-router-dom";
import {
    Container,
    Grid,
    Typography,
    Button,
    Paper,
    TextField,
} from "@mui/material";
import User from "../Providers/User";
import { useContext, useState } from "react";


const Home = () => {
    const userContext = useContext(User);
    const [idForm, setIdForm] = useState("");
    const history = useHistory();
    

    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mt: "12.5vw" }}
            >
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={1}
                        sx={{
                            padding: "100px",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "20px",
                        }}
                    >
                        <Typography
                            variant="h3"
                            align="center"
                            sx={{ mb: "30px" }}
                        >
                            Osu Profile Commenting System
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
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    history.push(`/profile/${idForm}`);
                                    
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "stretch",
                                    justifyContent: "center",
                                    margin: "10px",
                                }}
                            >
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Enter osu profile ID"
                                    variant="outlined"
                                    sx={{
                                        mx: "10px",
                                    }}
                                    value={idForm}
                                    onChange={(e) => setIdForm(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    Search
                                </Button>
                            </form>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

const ProfileSearch = () => {
    return <p>te</p>;
};

export default Home;
