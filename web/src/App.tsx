import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GlobalStyle } from './components/GlobalStyle';
import Layout from './components/Layout';
import Home from './pages/home';
import Login from './pages/user/Login';
import SignUp from './pages/user/SignUp';

function App() {
  return <BrowserRouter>
    <GlobalStyle />
    <Layout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/" component={Home} />
      </Switch>
    </Layout>
  </BrowserRouter>
}

export default App;
