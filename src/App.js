import React from "react";
import { Router, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import Timer from "./pages/Timer";
import "./App.css";
import IfOffline from "./components/IfOffline";
import { createBrowserHistory } from "history";
//--ga
import ReactGA from "react-ga";
const history = createBrowserHistory();

ReactGA.initialize("UA-00000-01");
ReactGA.pageview(window.location.pathname + window.location.search);

history.listen((location) => {
  ReactGA.pageview(window.location.pathname + window.location.search);
});

export default class App extends React.Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <header>
            <Link to="/">Recetas</Link>
            <Link to="/timer" className="timerLink">
              T
            </Link>
          </header>

          <main>
            <IfOffline>Estas modo offline</IfOffline>
            <Route exact path="/" component={Home} />
            <Route path="/recipe/:recipeId" component={Recipe} />
            <Route path="/timer" component={Timer} />
          </main>
        </div>
      </Router>
    );
  }
}
