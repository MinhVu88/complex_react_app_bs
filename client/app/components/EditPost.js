import React, { useEffect, useContext } from "react";
import { useParams, Link, withRouter } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import StateContext from "../contexts/StateContext";
import DispatchContext from "../contexts/DispatchContext";
import Page from "./Page";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";

export default withRouter(function EditPost({ history }) {
  function reducer(draft, action) {
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title;

        draft.body.value = action.value.body;

        draft.isFetching = false;

        return;

      case "titleChange":
        draft.title.isValid = true;

        draft.title.value = action.value;

        return;

      case "bodyChange":
        draft.body.isValid = true;

        draft.body.value = action.value;

        return;

      case "submitRequest":
        if (draft.title.isValid && draft.body.isValid) draft.axiosRequest++;

        return;

      case "postRequestBegan":
        draft.isSaving = true;

        return;

      case "postRequestFinished":
        draft.isSaving = false;

        return;

      case "titleFieldValidation":
        if (!action.value.trim()) {
          draft.title.isValid = false;

          draft.title.errorMsg = "title is required";
        }

        return;

      case "bodyFieldValidation":
        if (!action.value.trim()) {
          draft.body.isValid = false;

          draft.body.errorMsg = "body is required";
        }

        return;

      case "nonexistentPost":
        draft.postNotFound = true;

        return;
    }
  }

  const initialState = {
      title: {
        value: "",
        isValid: true,
        errorMsg: ""
      },
      body: {
        value: "",
        isValid: true,
        errorMsg: ""
      },
      isFetching: true,
      isSaving: false,
      id: useParams().id,
      axiosRequest: 0,
      postNotFound: false
    },
    [state, dispatch] = useImmerReducer(reducer, initialState),
    mainState = useContext(StateContext),
    mainDispatch = useContext(DispatchContext);

  function handleSubmit(e) {
    e.preventDefault();

    dispatch({ type: "titleFieldValidation", value: state.title.value });

    dispatch({ type: "bodyFieldValidation", value: state.body.value });

    dispatch({ type: "submitRequest" });
  }

  useEffect(() => {
    // generate a token that can be used to identify an Axios request
    const request = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: request.token
        });

        console.log(response.data);

        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });

          // if the currently logged-in user isn't the one that creates the post he's/she's viewing
          // that user isn't permitted to edit that post
          if (mainState.user.username !== response.data.author.username) {
            mainDispatch({
              type: "flashMessage",
              value: "You are not allowed to edit this post"
            });

            // redirect the unauthenticated user back to homepage
            history.push("/");
          }
        } else {
          dispatch({ type: "nonexistentPost" });
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }

    fetchPost();

    // return a clean-up function to prevent memory leaks/computer resources for unmounted/unrendered components
    return () => request.cancel();
  }, []);

  useEffect(() => {
    if (state.axiosRequest) {
      dispatch({ type: "postRequestBegan" });

      const request = Axios.CancelToken.source();

      async function fetchPost() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: mainState.user.token
            },
            { cancelToken: request.token }
          );

          console.log(response.data);

          dispatch({ type: "postRequestFinished" });

          mainDispatch({
            type: "flashMessage",
            value: "Post Successfully Updated"
          });
        } catch (error) {
          console.log(error.response.data);
        }
      }

      fetchPost();

      return () => request.cancel();
    }
  }, [state.axiosRequest]);

  if (state.postNotFound) {
    return <NotFound />;
  }

  if (state.isFetching)
    return (
      <Page title="...">
        <div>
          <LoadingIcon />
        </div>
      </Page>
    );

  return (
    <Page title="edit post">
      <Link className="small font-weight-bold" to={`/post/${state.id}`}>
        &laquo; Back to post
      </Link>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onBlur={e =>
              dispatch({ type: "titleFieldValidation", value: e.target.value })
            }
            onChange={e =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            value={state.title.value}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
          {!state.title.isValid && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.title.errorMsg}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            onBlur={e =>
              dispatch({ type: "bodyFieldValidation", value: e.target.value })
            }
            onChange={e =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
            value={state.body.value}
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
          />
          {!state.body.isValid && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.body.errorMsg}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          Save Updated Post
        </button>
      </form>
    </Page>
  );
});
