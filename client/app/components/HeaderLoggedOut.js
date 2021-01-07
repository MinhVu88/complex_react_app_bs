import React, { useState, useContext } from "react";
import Axios from "axios";
import DispatchContext from "../contexts/DispatchContext";

export default function HeaderLoggedOut() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const mainDispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await Axios.post("/login", { username, password });

      if (response.data) {
        console.log(response.data);

        mainDispatch({ type: "login", data: response.data });
      } else {
        console.log("Incorrect username/password");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={e => setUsername(e.target.value)}
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            onChange={e => setPassword(e.target.value)}
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}