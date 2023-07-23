// Third party
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "next/link";

// Local
import PostCard from "./PostCard";
import PostInterface from "../../types";
import styles from "./PostCards.module.css";

export default function PostCards({ posts }: { posts: PostInterface[] }) {
  return (
    <div>
      <Box>
        <Grid container spacing={2}>
          {posts.map((post: any) => (
            <Link
              key={post.slug}
              className={styles["post-link"]}
              href={`/blog/${post.slug}`}
            >
              <Grid item xs={4}>
                <PostCard post={post} />
              </Grid>
            </Link>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
