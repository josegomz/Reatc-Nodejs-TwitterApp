import React from 'react'
import APIInvoker from './utils/APIInvoker'
import browserHistory from './History'
import { Route, Switch } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import TweetsContainer from './TweetsContainer';
import TwitterDashboard from './TwitterDashboard';

class TwitterApp extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            load: false,
            profile: null
        }
    }

    componentDidMount(){
        let token = window.localStorage.getItem('token')
        if(token == null){
            this.setState({
                load: true,
                profile: null
            })
            browserHistory.push('/login')
        } else {
            APIInvoker.invokeGET('/secure/relogin', response => {
                this.setState({
                    load: true,
                    profile: response.profile
                })
                window.localStorage.setItem('token',response.token)
                window.localStorage.setItem('username',response.profile.username)
                browserHistory.push('/')
            }, error => {
                console.log('Error al autenticar al usuario')
                window.localStorage.removeItem('token')
                window.localStorage.removeItem('username')
                browserHistory('/login')
            })
        }
    }

    render(){
        if(!this.state.load){
            return null
        }

        return(
            <>
                <div id="mainApp" className="animate fadeIn">
                    <Switch>
                        <Route exact path="/" component={ () => 
                            <TwitterDashboard profile={this.state.profile}/> }/>
                        <Route exact path="/signup" component={Signup}/>
                        <Route exact path="/login" component={Login}/>
                    </Switch>
                    <div id="dialog" />
                </div>
            </>
        )
    }
}
export default TwitterApp;