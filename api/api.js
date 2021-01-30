var express = require('express')
var router = express.Router()
var userController = require('../api/controllers/UserController')
var tweetController = require('../api/controllers/TweetController')
const pug = require('pug')

var configuration = require('../serverConfig')
var jwt = require('jsonwebtoken')

//autorización con JSON web token
router.use('/', function (req, res, next) {
    var token = req.headers['authorization']
    if (!token) {
        req.user = null
        next()
        return
    }

    token = token.replace('Bearer ', '')
    jwt.verify(token, configuration.jwt.secret, function (err, user) {
        if (err) {
            req.user = null
            next()
        } else {
            req.user = user
            next()
        }
    })
})

//denegar el acceso a lo servicios restringidos
router.use('/secure', function (req, res, next) {
    if (req.user === null) {
        res.status(401).send({
            ok: false,
            message: 'Token inválido'
        })
        return
    }
    next()
})

router.get('/', function (req, res) {
    res.send(pug.renderFile(__dirname + '/../public/apidoc/api-index.pug'))
})

//private access services 
router.get('/secure/relogin',userController.relogin)
router.get('/secure/suggestedUsers',userController.getSuggestedUser)

//Public access services
router.get('/tweets',tweetController.getNewTweets)
router.get('/usernameValidate/:username', userController.usernameValidate)
router.post('/signup', userController.signup)
router.post('/login', userController.login)


router.get('/*', function (req, res, err) {
    res.status(400).send({ message: "Servicio inválido" })
})

module.exports = router;