import React from 'react'
import APIInvoker from "./utils/APIInvoker"
import PropTypes from 'prop-types'
import Tweet from './Tweet'
import { tweets } from '../config'
import InfiniteScroll from 'react-infinite-scroller'
import update from 'immutability-helper'
import Reply from './Reply';

class TweetsContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasMore: true,
            tweets: []
        }

        let username = this.props.profile.userName
        let onlyUserTweet = this.props.onlyUserTweet
        this.loadTweets(username, onlyUserTweet)
        this.loadMore = this.loadMore.bind(this)
    }
    loadTweets(username, onlyUserTweet, page) {
        let currentPage = page || 0
        let url = '/tweets' + (onlyUserTweet ? "/" + username : "")
        APIInvoker.invokeGET(url, response => {
            this.setState({
                tweets: this.state.tweets.concat(response.body),
                hasMore: response.body.length >= 10
            })
        }, error => {
            console.log("Error al cargar los Tweets", error);
        })
    }

    loadMore(page) {
        const username = this.props.profile.userName
        const onlyUserTweet = this.props.onlyUserTweet
        this.loadTweets(username, onlyUserTweet, page - 1)
    }

    addNewTweet(newTweet) {
        let oldState = this.state;
        let newState = update(this.state, {
            tweets: { $splice: [[0, 0, newTweet]] }
        })

        this.setState(newState)

        //Optimistic Update
        APIInvoker.invokePOST(
            '/secure/tweet'
            , newTweet, response => {
                this.setState(update(this.state, {
                    tweets: {
                        0: {
                            _id: { $set: response.tweet._id }
                        }
                    }
                }))
            }, error => {
                console.log("Error al cargar los Tweets");
                this.setState(oldState)
            }
        )
    }

    render() {
        let operations = {
            addNewTweet: this.addNewTweet.bind(this)
        }
        return (
            < main className="twitter-panel" >
                <Choose>
                    <When condition={this.props.onlyUserTweet} >
                        <div className="tweet-container-header"> TweetsDD </div>
                    </When>
                    <Otherwise>
                        <Reply profile={this.props.profile} operations={operations} />
                    </Otherwise>
                </Choose>
                <If condition={this.state.tweets != null}>
                    <For each="tweet" of={this.state.tweets}>
                        <Tweet key={tweet._id} tweet={tweet} />
                    </For>
                </If>
            </main>
        )
    }
}
TweetsContainer.propTypes = {
    onlyUserTweet: PropTypes.bool,
    profile: PropTypes.object
}

TweetsContainer.defaultProps = {
    onlyUserTweet: false,
    profile: {
        userName: ""
    }
}

export default TweetsContainer;