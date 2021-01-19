import React from 'react'
import { render } from 'react-dom'
import TwitterApp from './TwitterApp'
import { Router } from 'react-router'
import history from './History'

render((
    <Router history={history}>
        <TwitterApp></TwitterApp>
    </Router>
), document.getElementById('root'));
