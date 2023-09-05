import React, { lazy, Suspense } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import Layout from "@shared/layout";
import RouteGuard from "@shared/routeGuard";
import { createBrowserHistory } from "history";
import isLogin from "@utils/isLogin";

const ArticlePage = lazy(() => import("@pages/articlePage"));
const PublishPage = lazy(() => import("@pages/publishPage"));
const LoginPage = lazy(() => import("@pages/loginPage"));
const DashboardPage = lazy(() => import("@pages/dashboardPage"));

export const history = createBrowserHistory();

export default class AppRouter extends React.Component {
  render() {
    return (
      <Router history={history}>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Redirect from="/" to="/login" exact />
            <Route path="/login" component={LoginPage}></Route>
            <Route path="/admin">
              <RouteGuard
                guards={[isLogin]}
                onRejected={() => <Redirect to="/login" push={false} />}
              >
                <Layout>
                  <Suspense fallback={<Loading />}>
                    <Switch>
                      <Redirect from="/admin" to="/admin/dashboard" exact />
                      <Route
                        path="/admin/dashboard"
                        component={DashboardPage}
                      />
                      <Route path="/admin/article" component={ArticlePage} />
                      <Route
                        path="/admin/publish/:id"
                        component={PublishPage}
                      />
                      <Route path="/admin/publish" component={PublishPage} />
                    </Switch>
                  </Suspense>
                </Layout>
              </RouteGuard>
            </Route>
          </Switch>
        </Suspense>
      </Router>
    );
  }
}

class Loading extends React.Component {
  render() {
    return (
      <div className="justify-content align-items">
        <i className="fas fa-spinner fa-pulse"></i>
      </div>
    );
  }
}
