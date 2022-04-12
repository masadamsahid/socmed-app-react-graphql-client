import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, GridColumn, GridRow, TransitionGroup } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

function Home() {
  const context = useContext(AuthContext);

  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);

  if (posts) {
    console.log(posts);
  }

  return (
    <Grid columns={3}>
      <GridRow className="page-title">
        <h1>Recent Posts</h1>
      </GridRow>
      <GridRow>
        {context.user && (
          <GridColumn>
            <PostForm />
          </GridColumn>
        )}
        {loading ? (
          <h1>Loading posts ...</h1>
        ) : (
          <TransitionGroup>
            {posts &&
              posts.map((post) => (
                <GridColumn key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </GridColumn>
              ))}
          </TransitionGroup>
        )}
      </GridRow>
    </Grid>
  );
}

export default Home;
