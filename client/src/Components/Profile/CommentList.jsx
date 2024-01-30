import { FixedSizeList } from "react-window";
import {
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CommentList = ({ comments }) => {
    return (
        <List sx={{ maxHeight: "400px", overflow: "auto" }}>
            <FixedSizeList
                height={400}
                itemSize={70}
                itemCount={comments.length}
            >
                {({ index, style }) => (
                    <div style={style}>
                        <CommentListItem
                            username={comments[index].username}
                            id={comments[index].userId}
                            commentText={comments[index].comment}
                        />
                    </div>
                )}
            </FixedSizeList>
        </List>
    );
};

const CommentListItem = ({ username, id, commentText }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/profile/${id}`, {replace: true});
        
    }
    const style = {
        cursor: "pointer"
    }
    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemAvatar onClick={handleClick}
                sx={style}
                >
                    <Avatar src={`https://a.ppy.sh/${id}`} alt={username} />
                </ListItemAvatar>
                <ListItemText primary={username} secondary={commentText} onClick={handleClick} sx={style}
                />
            </ListItem>
        </>
    );
};

export default CommentList;
