import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingIcon from "./LoadingIcon";

export default function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true),
    [posts, setPosts] = useState([]),
    { username } = useParams();

  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: request.token
        });

        console.log(response.data);

        setPosts(response.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
      }
    }

    fetchPosts();

    return () => request.cancel();
  }, []);

  if (isLoading)
    return (
      <div>
        <LoadingIcon />
      </div>
    );

  return (
    <div className="list-group">
      {posts.map(post => {
        const date = new Date(post.createdDate),
          formattedDate = `${
            date.getMonth() + 1
          }/${date.getDate()}/${date.getFullYear()}`;

        return (
          <Link
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
            key={post._id}
          >
            <img className="avatar-tiny" src={post.author.avatar} />{" "}
            <strong>{post.title}</strong>{" "}
            <span className="text-muted small">on {formattedDate} </span>
          </Link>
        );
      })}
    </div>
  );
}
