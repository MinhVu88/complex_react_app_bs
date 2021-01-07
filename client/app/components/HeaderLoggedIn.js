import React, { useContext } from "react";
import { Link } from "react-router-dom";
import StateContext from "../contexts/StateContext";
import DispatchContext from "../contexts/DispatchContext";

export default function HeaderLoggedIn() {
  const mainState = useContext(StateContext);
  const mainDispatch = useContext(DispatchContext);

  function handleLogout() {
    mainDispatch({ type: "logout" });
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a href="#" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </a>
      <span className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to={`/profile/${mainState.user.username}`} className="mr-2">
        <img className="small-header-avatar" src={mainState.user.avatar} />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}
