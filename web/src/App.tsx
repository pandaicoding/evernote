import { BrowserRouter, Redirect, Route, RouteProps, Switch } from 'react-router-dom';
import { GlobalStyle } from './components/GlobalStyle';
import Layout from './components/Layout';
import { Loading } from './components/Loading';
import { isAuthenticated, usePrepareApp } from './helper/auth';
import Home from './pages/home';
import Login from './pages/user/Login';
import SignUp from './pages/user/SignUp';

function App() {
  const { isLoading } = usePrepareApp();

  if (isLoading) {
    return <Loading />;
  }
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Layout>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <AuthRoute path="/" component={Home} />
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}

const AuthRoute = (props: RouteProps) => {
  if (isAuthenticated()) {
    return <Route {...props} />
  }
  return <Redirect to="/login" />
}
export default App;
