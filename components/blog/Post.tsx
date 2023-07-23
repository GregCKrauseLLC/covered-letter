// Third party
import Typography from "@mui/material/Typography";

// Local
import styles from "./Post.module.css";
import PostInterface from "../../types";

export default function Post({ post }: { post: PostInterface }) {
  return (
    <div>
      <Typography className={styles.title} variant="h4" component="div">
        {post.title}
      </Typography>
      <Typography variant="subtitle1" component="div">
        {post.description}
      </Typography>
      <Typography
        className={styles.body}
        variant="body1"
        paragraph
        component="div"
      >
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </Typography>
    </div>
  );
}
