import React, { useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import StateContext from "../contexts/StateContext";
import DispatchContext from "../contexts/DispatchContext";
import Axios from "axios";
import Page from "./Page";

export default withRouter(function CreatePost({ history }) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const mainState = useContext(StateContext);
  const mainDispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: mainState.user.token
      });

      console.log("new post created", response);

      // redirect to the newly created post url
      history.push(`/post/${response.data}`);

      mainDispatch({ type: "flashMessage", value: "new post created" });
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <Page title="create new post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={e => setTitle(e.target.value)}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onChange={e => setBody(e.target.value)}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
});
