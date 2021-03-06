// React's core modules & some external ones
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

// contexts
import StateContext from "./contexts/StateContext";
import DispatchContext from "./contexts/DispatchContext";

// components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";

Axios.defaults.baseURL = "http://localhost:8080";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("reactToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("reactToken"),
      username: localStorage.getItem("reactUsername"),
      avatar: localStorage.getItem("reactAvatar")
    }
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;

        draft.user = action.data;

        return;

      case "logout":
        draft.loggedIn = false;

        return;

      case "flashMessage":
        draft.flashMessages.push(action.value);

        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("reactToken", state.user.token);

      localStorage.setItem("reactUsername", state.user.username);

      localStorage.setItem("reactAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("reactToken");

      localStorage.removeItem("reactUsername");

      localStorage.removeItem("reactAvatar");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />

          <Header />

          <Switch>
            <Route path="/profile/:username">
              <Profile />
            </Route>

            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>

            <Route path="/create-post">
              <CreatePost />
            </Route>

            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>

            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>

            <Route path="/about-us">
              <About />
            </Route>

            <Route path="/terms">
              <Terms />
            </Route>

            <Route>
              <NotFound />
            </Route>
          </Switch>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) module.hot.accept();
