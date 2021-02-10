import React from 'react'
import APIInvoker from './utils/APIInvoker'
import browserHistory from './History'
import { Route, Switch } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import TwitterDashboard from './TwitterDashboard';
import AuthRoute from './AuthRouter'
import Toolbar from './Toolbar';
import UserPage from './UserPage';
import UserCard from './UserCard';
import UserContext from './context/UserContext';
import useLogin from './hooks/useLogin';

const TwitterApp = (props) => {

    const [load, user] = useLogin()

    const render = () => {
        if (!load) return null

        return (
            <UserContext.Provider value={user}>
                <Toolbar />
                <div id="mainApp" className="animate fadeIn">
                    <Switch>
                        <AuthRoute isLoged={user != null} exact path="/" component={TwitterDashboard} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/login" component={Login} />
                        <AuthRoute isLoged={user != null} path="/:user" component={UserPage} />
                    </Switch>
                    <div id="dialog" />
                </div>
            </UserContext.Provider>
        )
    }
    return render()
}
export default TwitterApp;