var authService = require('../services/AuthService')
var Profile = require('../models/Profile')
var bcrypt = require('bcryptjs')


// Servicio para crear un nuevo usuario
const signup = async (req, res, err) => {
    try {
        // Create a new profile object
        let newProfile = new Profile({
            name: req.body.name,
            userName: req.body.username.toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 10)
        })

        // Create a new profile in the database
        newProfile = await newProfile.save()

        // Return the new created profile
        res.send({
            ok: true,
            body: {
                profile: newProfile
            }
        })

    } catch (err) {
        console.log(err)
        let errorMessage = null
        if (err.errors != null && err.errors.userName != null) {
            errorMessage = "Nombre de usuario existente"
        } else {
            errorMessage = 'Error al guardar el usuario'
        }
        res.send({
            ok: false,
            message: "Error al crear el usuario",
            error: errorMessage || err.message
        })
    }
}

const usernameValidate = async (req, res, err) => {
    try {
        let profiles = await Profile.find().byUsername(req.params.username.toLowerCase())
        if (profiles.length > 0) throw new Error("Usuario existente")
        res.send({
            ok: true,
            message: "Usuario disponible"
        })
    } catch (err) {
        res.send({
            ok: false,
            message: err.message || "Error al validar el nombre de usuario"
        })
    }
}

// Servicio que autentica a un usuario a partir del usuario/password y genera un token
const login = async (req, res, err) => {
    try {
        let profile = await Profile.findOne({ userName: req.body.username.toLowerCase() })
        if (profile == null) throw new Error("Usuario y contraseña inválida")


        let valid = await bcrypt.compare(req.body.password, profile.password)
        if (!valid) throw new Error('Usuario y password inválidos')

        let user = {
            username: req.body.username,
            id: profile._id
        }

        let token = authService.generateToken(user)

        res.send({
            ok: true,
            profile: {
                id: profile.id,
                name: profile.name,
                userName: profile.userName,
                avatar: profile.avatar || '/public/resources/avatars/0.png',
                banner: profile.banner || '/public/resources/banners/4.png',
                tweetCount: profile.tweetCount,
                following: profile.following,
                followers: profile.followers
            },
            token: token
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || "Error al validar el usuario"
        })
    }
}

// Servicio que autentica a un usuario a partir del token
const relogin = async (req, res, err) => {
    try {
        let userToken = {
            id: req.user.id,
            username: req.user.username
        }
        let newToken = authService.generateToken(userToken)

        let profile = await Profile.findOne({ _id: req.user.id })
        if (profile === null) throw new Error("No existe el usuario")

        res.send({
            ok: true,
            profile: {
                id: profile._id,
                name: profile.name,
                userName: profile.userName,
                avatar: profile.avatar || '/public/resources/avatars/0.png',
                banner: profile.banner || '/public/resources/banners/4.png',
                tweetCount: profile.tweetCount,
                following: profile.following,
                followers: profile.followers
            },
            token: newToken
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || "Error al validar el usuario"
        })
    }
}
// Servicio que consulta usuarios sugeridos para seguir
const getSuggestedUser = async (req, res, err) => {
    let user = req.user

    try {
        let users = await Profile.find({ userName: { $ne: user.username } })
            .sort({ "date": -1 })
            .limit(6)

        res.send({
            ok: true,
            body: users.map(x => {
                return {
                    _id: x._id,
                    name: x.name,
                    description: x.description,
                    userName: x.userName,
                    avatar: x.avatar || '/public/resources/avatars/0.png',
                    banner: x.banner || '/public/resources/banners/4.png',
                    tweetCount: x.tweetCount,
                    following: x.following,
                    followers: x.followers
                }
            })
        })
    } catch (error) {
        res.send({
            ok: false,
            message: error.message || "Error al validar el usuario"
        })
    }
}


module.exports = {
    usernameValidate,
    signup,
    login,
    relogin,
    getSuggestedUser
}