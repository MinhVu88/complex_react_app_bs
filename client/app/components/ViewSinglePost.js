import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, withRouter } from "react-router-dom";
import Axios from "axios";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import StateContext from "../contexts/StateContext";
import DispatchContext from "../contexts/DispatchContext";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";

export default withRouter(function ViewSinglePost({ history }) {
  const [isLoading, setIsLoading] = useState(true),
    [post, setPost] = useState(),
    { id } = useParams(),
    mainState = useContext(StateContext),
    mainDispatch = useContext(DispatchContext);

  useEffect(() => {
    // generate a token that can be used to identify an Axios request
    const request = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: request.token
        });

        console.log(response.data);

        setPost(response.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    }

    fetchPost();

    // return a clean-up function to prevent memory leaks/computer resources for unmounted/unrendered components
    return () => request.cancel();
  }, []);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <div>
          <LoadingIcon />
        </div>
      </Page>
    );

  const date = new Date(post.createdDate),
    formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

  function isPostCreator() {
    if (mainState.loggedIn)
      return mainState.user.username === post.author.username;

    return false;
  }

  async function handleDelete() {
    const deletionConfirmed = window.confirm(
      "Are you sure of deleting this post?"
    );

    if (deletionConfirmed) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: mainState.user.token }
        });

        if (response.data === "Success") {
          // display a flash message confirming the deletion
          mainDispatch({
            type: "flashMessage",
            value: "Post successfully removed"
          });

          // redirect the currently logged-in/auth user back to the his/her profile
          history.push(`/profile/${mainState.user.username}`);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>

        {isPostCreator() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              onClick={handleDelete}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {formattedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown
          source={post.body}
          allowedTypes={[
            "paragraph",
            "emphasis",
            "strong",
            "text",
            "list",
            "listItem",
            "heading"
          ]}
        />
      </div>
    </Page>
  );
});
