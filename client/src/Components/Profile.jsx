import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import User from "../Providers/User";
import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Container,
    Grid,
    Divider,
} from "@mui/material";

const Profile = ({ user }) => {
    const userContext = useContext(User);
    const { id } = useParams();
    console.log(user)

    const logout = () => {
        userContext.logOut();
    };
    if (!user) {
        return (
            <div>
                <p>{!id ? "Not Logged In" : <OtherUser id={id} />} </p>
                <Link to="/">Home</Link>
            </div>
        );
    }
    return (
        <div>
            <p>
                {/* {!id ? (
                    "Logged into: " + userId + " - " + username
                ) : (
                    <OtherUser id={id} />
                )} */}

                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: "7.5vw" }}
                >
                    <Grid item xs={12} md={8}>
                        <ProfileCard profileData={user} />
                    </Grid>
                </Grid>
            </p>
        </div>
    );
};

const OtherUser = ({ id }) => {
    const [error, setError] = useState(false);
    useEffect(() => {
        axios
            .get("/api/profile", {
                params: {
                    id: id,
                },
            })
            .then((res) => {
                console.log(res.data);
                setError(!res.data.success);
            });
    });

    if (error) {
        return (
            <div>
                <p>Error fetching user data</p>
            </div>
        );
    }

    return (
        <div>
            <p>Viewing user: {id}</p>
        </div>
    );
};

const ProfileCard = ({ profileData }) => {
    return (
        <Card sx={{ display: "flex" }}>
            <Grid container spacing={0} justifyContent="center" columns={16}>
                <Grid item xs={16} md={6}>
                    <Box>
                        <CardContent>
                            <Typography variant="h4" sx={{ my: "0.5vh"}} align={"center"}>{profileData.username}</Typography>
                            <Divider variant="middle" sx={{ my: "1vh"}}/>
                            <img
                                src={`https://a.ppy.sh/${profileData.userId}`}
                                alt="avatar"
                                style={{
                                    width: "75%",
                                    height: "75%",
                                    borderRadius: "50%",
                                    display: "block",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            />
                        </CardContent>
                        <Divider variant="middle" sx={{ my: "1vh" }}/>
                        <CardContent sx={{display: "flex", flexGrow: 1, flexDirection: "row", justifyContent: "space-between"}}>
                            <Typography variant="h6" align={"center"}>#{profileData.statistics.rank}</Typography>
                            <Typography variant="h6" align={"center"}>{Math.round(profileData.statistics.pp)}pp</Typography>
                        </CardContent>
                    </Box>
                </Grid>
                <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ sm: { display: "none" }, md: { display: "flex" } }}
                />
                <Divider
                    orientation="horizontal"
                    variant="middle"
                    flexItem
                    sx={{ sm: { display: "flex" }, md: { display: "none" } }}
                />
                <Grid item xs={16} md={9}>
                    <Container maxWidth="lg" sx={{mt: "1vw"}}>
                            <Typography variant="h4" color="white" align="center">Comments</Typography>
                    </Container>
                </Grid>
            </Grid>
        </Card>
    );
};



export default Profile;
