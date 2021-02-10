import React, { useState, useEffect }  from 'react'
import UserCard from './UserCard';
import APIInvoker from './utils/APIInvoker';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

const Followers = (props) => {
    const [state, setState] = useState([])

    useEffect(() => {
        let username = props.profile.userName
        APIInvoker.invokeGET(`/followers/${username}`, response => {
            setState(response.body)
        }, error => {
            console.log("Error en la autenticación");
        })
    }, [props.profile.userName]
    )
    return (
        <section>
            <div className="container-fluid no-padding">
                <div className="row no-padding">
                    <CSSTransitionGroup
                        transitionName="card"
                        transitionEnter={true}
                        transitionEnterTimeout={500}
                        transitionAppear={false}
                        transitionAppearTimeout={0}
                        transitionLeave={false}
                        transitionLeaveTimeout={0}>
                        <For each="user" of={state}>
                            <div className="col-xs-12 col-sm-6 col-lg-4"
                                key={user._id}>
                                <UserCard user={user} />
                            </div>
                        </For>
                    </CSSTransitionGroup>
                </div>
            </div>
        </section>
    )
}


Followers.PropTypes = {
    profile: PropTypes.object
}

export default Followers