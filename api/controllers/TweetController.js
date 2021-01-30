var Profile = require('../models/Profile')
var Tweet = require('../models/Tweet')
var mongoose = require('mongoose')

const getNewTweets = async (req, res, err) => {
    let user = req.user || {}
    let page = req.query.page;
    let perPage = 10

    try {
        //Query the first 10 tweets
        let tweets = await Tweet.find({ tweetParent: null })
            .populate("_creator", { banner: 0 })
            .sort({ '_id': -1 })
            .limit(10)
            .skip(perPage * page)

        // Transform MongoDB response
        let response = tweets.map(x => {
            return {
                _id: x._id,
                _creator: {
                    _id: x._creator._id,
                    name: x._creator.name,
                    userName: x._creator.userName,
                    avatar: x._creator.avatar || './public/resources/avatars/0.png'
                },
                date: x.date,
                message: x.message,
                liked: x.likeRef.find(
                    likeUser => likeUser.toString() === user.id || null),
                likeCounter: x.likeCounter,
                replys: x.replys,
                image: x.image
            }
        })

        res.send({
            ok: true,
            body: response
        })

    } catch (error) {
        console.log(error)
        res.send({
            ok: false,
            message: "Error al cargar los Tweets",
            error: error
        })
    }
}

module.exports = {
    getNewTweets
}