import React, { useEffect, useState } from 'react'
import UserCard from './UserCard';
import APIInvoker from './utils/APIInvoker';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { connect } from 'react-redux'
import { loadFollowings } from './redux/actions/userPageActions'

const Followings = (props) => {

    useEffect(() => {
        if (props.state === null) {
            props.loadFollowings()
        }
    }, [props.profile.userName])

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
                        <For each="user" of={props.state || []}>
                            <div className="col-xs-12 col-sm-6 col-lg-4"
                                key={this.state.tab + "-" + user._id}>
                                <UserCard user={user} />
                            </div>
                        </For>
                    </CSSTransitionGroup>
                </div>
            </div>
        </section>
    )

}
Followings.PropTypes = {
    profile: PropTypes.object
}
function mapStateToProps(state) { return {
    state: state.userPage.followings }
}
export default connect(mapStateToProps, {loadFollowings})(Followings)
