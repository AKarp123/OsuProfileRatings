import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import User from "../../Providers/User";
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
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

const Profile = ({ user }) => {
    const userContext = useContext(User);
    const { id } = useParams();
    // console.log(id);

    const logout = () => {
        userContext.logOut();
    };
    if (!user) {
        return (
            <div>
                <p>
                    {!id ? (
                        "Not Logged In"
                    ) : (
                        <Grid
                            container
                            spacing={2}
                            justifyContent="center"
                            sx={{ mt: "4.5vw" }}
                        >
                            <Grid item xs={12} md={8}>
                                <OtherUser id={id} />
                            </Grid>
                        </Grid>
                    )}
                </p>
            </div>
        );
    }
    return (
        <div>
            <p>
                {!id ? (
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        sx={{ mt: "4.5vw" }}
                    >
                        <Grid item xs={12} md={8}>
                            <ProfileCard profileData={user} />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        sx={{ mt: "4.5vw" }}
                    >
                        <Grid item xs={12} md={8}>
                            <OtherUser id={id} />
                        </Grid>
                    </Grid>
                )}
            </p>
        </div>
    );
};

const OtherUser = ({ id }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        axios
            .get("/api/profile", {
                params: {
                    id: id,
                },
            })
            .then((res) => {
                
                setUserData(res.data);
            });
    }, []);
    
    if (userData == null) {
        return <div>Loading...</div>;
    }
    if(userData.success === false){
        return <div>{userData.message}</div>
    }
    return (
        <div>
            <ProfileCard profileData={userData.user} />
        </div>
    );
    

};

const ProfileCard = ({ profileData }) => {
    console.log(profileData)
    const [comments, setComments] = useState(profileData.comments);
    const updateComments = (newComment) => {
        console.log("HELLO")
        setComments([newComment, ...comments]);
    }
    return (
        <Card sx={{ display: "flex", maxHeight: "100%" }}>
            <Grid container spacing={0} justifyContent="center" columns={16}>
                <Grid item xs={16} md={6}>
                    <Box>
                        <CardContent>
                            <Typography
                                variant="h4"
                                sx={{ my: "0.5vh" }}
                                align={"center"}
                            >
                                {profileData.username}
                            </Typography>
                            <Divider variant="middle" sx={{ my: "1vh" }} />
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
                        <Divider variant="middle" sx={{ my: "1vh" }} />
                        <CardContent
                            sx={{
                                display: "flex",
                                flexGrow: 1,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography variant="h6" align={"center"}>
                                #{profileData.statistics.rank}
                            </Typography>
                            <Typography variant="h6" align={"center"}>
                                {Math.round(profileData.statistics.pp)}pp
                            </Typography>
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
                    <Container
                        maxWidth="lg"
                        sx={{ mt: "1vw", maxHeight: "100%" }}
                    >
                        <Typography variant="h4" color="white" align="center">
                            Comments
                        </Typography>
                        <CommentList comments={comments} />
                    </Container>
                </Grid>
                {/* <Grid item xs={16} md={6}>
                    <Container maxWidth="lg" sx={{ mt: "1vw" }}>
                        <Typography variant="h4" color="white" align="center">
                            Your Comments
                        </Typography>
                        
                    </Container>
                </Grid> */}
                <Grid item xs={16} md={9}>
                    
                        <Typography variant="h4" color="white" align="center">
                            Comment
                        </Typography>
                        <CommentForm userId={profileData.userId} updateComments={updateComments} />
                    
                </Grid>
            </Grid>
        </Card>
    );
};

export default Profile;
