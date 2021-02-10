import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import browserHistory from './History'
import update from 'immutability-helper'

import APIInvoker from './utils/APIInvoker'


class Tweet extends React.Component {

    constructor(props) {
        super(props)
        this.state = props.tweet
        props.tweet.hola = "hola"
    }

    handleClick(e) {
        if (this.props.detail || e.target.getAttribute("data-ignore-onclick")) {
            return
        }
        let url = "/" + this.state._creator.userName + "/" + this.state._id
        browserHistory.push(url)
    }

    handleLike(e) {
        e.preventDefault()
        let request = {
            tweetID: this.state._id,
            like: !this.state.liked
        }
        APIInvoker.invokePOST('/secure/like', request, response => {
            let newState = update(this.state, {
                likeCounter: { $set: response.body.likeCounter },
                liked: { $apply: (x) => { return !x } }
            })
            this.setState(newState)
        }, error => {
            console.log("Error al cargar los Tweets", error);
        })
    }


    render() {
        let tweet = this.props.tweet //variable local para el acceso mas simple
        let tweetClass = null //determinar las clases de estilo 
        if (this.props.detail) {
            tweetClass = 'tweet detail'
        } else {
            tweetClass = tweet.isNew ? 'tweet fadeIn animated' : 'tweet'
        }

        return (
            <article className={tweetClass} id={'tweet-' + tweet._id} onClick={this.props.detail ? '' : this.handleClick.bind(this)}>
                <img src={tweet._creator.avatar} className="tweet-avatar" />
                <div className="tweet-body">
                    <div className="tweet-user">
                        <Link to={`/${this.state._creator.userName}`}>
                            <span className="tweet-name" data-ignore-onclick>
                                {this.state._creator.name}
                            </span>
                        </Link>
                        <Link to={`/${this.state._creator.userName}`}>
                            <span className="tweet-username">@{this.state._creator.userName}</span>
                        </Link>
                    </div>
                    <p className="tweet-message">{tweet.message}</p>
                    <If condition={tweet.image != null}>
                        <img className="tweet-img" src={tweet.image} />
                    </If>
                    <div className="tweet-footer">
                        <a className={tweet.liked ? 'like-icon liked' : 'like-icon'} onClick={this.handleLike.bind(this)} data-ignore-onclick>
                            <i className="fa fa-heart" aria-hidden="true" data-ignore-onclick></i>
                            {tweet.likeCounter}
                        </a>
                        <If condition={!this.props.detail} >
                            <a className="reply-icon" data-ignore-onclick>
                                <i className="fa fa-reply " aria-hidden="true" data-ignore-onclick></i> {tweet.replys}
                            </a>
                        </If>
                    </div>
                </div>
                <div id={"tweet-detail-" + tweet._id} />
            </article>
        )
    }
}
Tweet.propTypes = {
    tweet: PropTypes.object.isRequired, detail: PropTypes.bool
}
Tweet.defaultProps = {
    detail: false
}
export default Tweet;