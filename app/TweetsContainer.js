import React from 'react'
import APIInvoker from "./utils/APIInvoker"
import PropTypes from 'prop-types'
import Tweet from './Tweet'
import { tweets } from '../config'
import InfiniteScroll from 'react-infinite-scroller'

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

    render() {
        return (
            < main className="twitter-panel" >
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore}
                    hasMore={this.state.hasMore}
                    loader={<div className="loader" key={0}>Loading ...</div>} >

                    < For each="tweet" of={this.state.tweets} >
                        <Tweet key={tweets._id} tweet={tweet} />
                    </For >
                </InfiniteScroll>
            </main >
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