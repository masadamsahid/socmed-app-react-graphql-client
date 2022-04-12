import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMeta,
  Dimmer,
  Form,
  Grid,
  GridColumn,
  GridRow,
  Icon,
  Image,
  Label,
  Loader,
} from "semantic-ui-react";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import MyPopup from "../utils/MyPopup";

function SinglePost(props) {
  const navigate = useNavigate();
  const { postId } = useParams();

  const context = useContext(AuthContext);

  const commentInputRef = useRef(null);

  const [comment, setComment] = useState("");

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBIMT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    navigate("/");
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = (
      <Dimmer active inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <GridRow>
          <GridColumn width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              floated="right"
            />
          </GridColumn>
          <GridColumn width={10}>
            <Card fluid>
              <CardContent>
                <CardHeader>{username}</CardHeader>
                <CardMeta>{moment(createdAt).fromNow()}</CardMeta>
                <CardDescription>{body}</CardDescription>
              </CardContent>
              <hr />
              <CardContent extra>
                <LikeButton
                  user={context.user}
                  post={{ id, likeCount, likes, comments, commentCount }}
                />
                <MyPopup content="Comment on post">
                  <Button
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log("comment on post")}
                  >
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {context.user && context.user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </CardContent>
            </Card>
            {context.user && (
              <Card fluid>
                <CardContent>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment ..."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <CardContent>
                  {context.user &&
                    context.user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                  <CardHeader>{comment.username}</CardHeader>
                  <CardMeta>{moment(comment.createdAt).fromNow()}</CardMeta>
                  <CardDescription>{comment.body}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </GridColumn>
        </GridRow>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBIMT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
