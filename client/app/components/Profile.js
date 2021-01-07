import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import StateContext from "../contexts/StateContext";
import Page from "./Page";
import ProfilePosts from "./ProfilePosts";

export default function Profile() {
  const { username } = useParams(),
    mainState = useContext(StateContext),
    [profileData, setProfileData] = useState({
      profileUsername: "....",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" }
    });

  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchUser() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          { token: mainState.user.token },
          { cancelToken: request.token }
        );

        console.log(response.data);

        setProfileData(response.data);
      } catch (error) {
        console.log(error.response.data);
      }
    }

    fetchUser();

    return () => request.cancel();
  }, []);

  return (
    <Page title="profile screen">
      <h2>
        <img className="avatar-small" src={profileData.profileAvatar} />{" "}
        {profileData.profileUsername}
        <button className="btn btn-primary btn-sm ml-2">
          Follow <i className="fas fa-user-plus"></i>
        </button>
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <a href="#" className="active nav-item nav-link">
          Posts: {profileData.counts.postCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Followers: {profileData.counts.followerCount}
        </a>
        <a href="#" className="nav-item nav-link">
          Following: {profileData.counts.followingCount}
        </a>
      </div>

      <ProfilePosts />
    </Page>
  );
}
