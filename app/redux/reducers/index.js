import { combineReducers } from 'redux'
import userPageReducer from './userPageReducers'
import tweetsReduce from './tweetsReducer'

export default combineReducers({
    userPage: userPageReducer,
    tweets: tweetsReduce
})