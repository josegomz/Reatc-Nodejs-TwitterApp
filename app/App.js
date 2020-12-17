import React from 'react'
import { render } from 'react-dom'
import TweetsContainer from './TweetsContainer'
import APIInvoker from './utils/APIInvoker'
import Signup from './Signup';
import Login from './Login';

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            tweets: []
        }
        APIInvoker.invokeGET('/tweets', response => {
            this.setState({
                tweets: response.body
            })
        }, error => {
            console.log('Error al cargar los tweets')
        })
    }



    render() {
        console.log(this.state.tweets)
        return (
            <div className="container">
                <Login></Login>
                
            </div>
        )
    }
}
render(<App />, document.getElementById('root'));
