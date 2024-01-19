
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import User from "../Providers/User";

const Profile = ({ user }) => {
    let navigate = useNavigate();
    const userContext = useContext(User);
    const { id } = useParams();
    // console.log(id)
    const logout = () => {
        userContext.logOut();
    };
    if (!user) {
        return (
            <div>
                <p>{!id ? "Not Logged In" : <LoggedOutUser id={id} />} </p>
                <Link to="/">Home</Link>
            </div>
        );
    }
    const { userId, username } = user;
    return (
        <div>
            <p>
                {!id ? (
                    "Logged into: " + userId + " - " + username
                ) : (
                    <LoggedOutUser id={id} />
                )}
            </p>
            <Link to="/">Home</Link>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

const LoggedOutUser = ({ id }) => {
    useEffect(() => {
        axios
            .get("/api/profile", {
                params: {
                    id: id,
                },
            })
            .then((res) => {
                console.log(res.data);
            });
    });

    return (
        <div>
            <p>Viewing user: {id}</p>
        </div>
    );
};

export default Profile;
