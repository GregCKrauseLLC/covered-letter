// Third party
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

// Local
import styles from "./PostCard.module.css";
import PostInterface from "../../types";

export default function PostCard({ post }: { post: PostInterface }) {
  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2">{`${post.description.substring(
          0,
          70
        )}...`}</Typography>
      </CardContent>
    </Card>
  );
}
