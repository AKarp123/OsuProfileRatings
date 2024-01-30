import { useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Alert,
    Collapse,
    IconButton,
    Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const CommentForm = ({ userId, updateComments }) => {
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });

    const submitComment = (e) => {
        e.preventDefault();
        axios
            .post("/api/submitComment", {
                comment: comment,
                userId: userId,
            })
            .then((res) => {
                console.log(res);
                if (res.data.success) {
                    setStatus({ type: "success", message: res.data.message });
                    updateComments(res.data.comment);
                }
                else {
                    setStatus({ type: "error", message: res.data.message });
                }
                setComment("");
            })
            .catch((err) => {
                console.log(err);
                setStatus({
                    type: "error",
                    message: err.response.data.message,
                });
            });
    };
    return (
        <>
            <form onSubmit={submitComment}>
                <Grid container>
                    <Grid item xs={12} md={8}>
                        <TextField
                            id="outlined-multiline-static"
                            label="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            defaultValue="Default Value"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                open={status.message !== ""}
                autoHideDuration={2000}
                onClose={() => setStatus({ type: "", message: "" })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={status.type}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    
                    {status.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CommentForm;
