import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

const NotFound = () => {
  return (
    <Page title="not found">
      <div className="text-center">
        <h2>404 Not Found</h2>
        <p className="lead text-muted">
          <Link to="/">[ Home ]</Link>
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
