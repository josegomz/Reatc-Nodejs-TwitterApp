import React from 'react';
import  update  from 'immutability-helper';
import APIInvoker from './utils/APIInvoker';
import { Link } from 'react-router-dom';
import UserContext from './context/UserContext'
import {Redirect} from 'react-router-dom'

class Login extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {
            username: "",
            password: ""
        }
    }

    handleInput(e) {
        let field = e.target.name
        let value = e.target.value

        if (field == 'username') {
            value = value.replace(' ', '').replace('@', '').substring(0, 15)//el usuario no acepta espacios ni @
            this.setState(update(this.state, {
                [field]: { $set: value }
            }))
        } else {
            this.setState(update(this.state, {//nombre o contaseña solo actualiza
                [field]: { $set: value }
            }))
        }
    }

    login(e) {
        e.preventDefault()

        let request = {
            "username": this.state.username,
            "password": this.state.password
        }

        APIInvoker.invokePOST('/login', request, response => {
            window.localStorage.setItem("token", response.token)
            window.localStorage.setItem("username", response.profile.userName)
            window.location = '/'
        }, error => {
            this.submitBtnLabel.innerHTML = error.message
            this.submitBtnLabel.className = 'shake animated'
            console.log("Error en la autenticación")
        })
    }

    render() {
        if(this.context != null){
            return <Redirect to="/"/>            
        }
        //seccion de variables y lgica
        return (//codigo JSX
            <div id="signup">
                <div className="container" >
                    <div className="row">
                        <div className="col-xs-12">
                        </div>
                    </div>
                </div>
                <div className="signup-form">
                    <form onSubmit={this.login.bind(this)}>
                        <h1>Iniciar sesión en Twitter</h1>

                        <input type="text" value={this.state.username}
                            placeholder="usuario" name="username" id="username"
                            onChange={this.handleInput.bind(this)} />
                        <label ref={self => this.usernameLabel = self} id="usernameLabel"
                            htmlFor="username"></label>

                        <input type="password" id="passwordLabel" value={this.state.password}
                            placeholder="Contraseña" name="password"
                            onChange={this.handleInput.bind(this)} />
                        <label ref={self => this.passwordLabel = self}
                            htmlFor="passwordLabel"></label>

                        <button className="btn btn-primary btn-lg " id="submitBtn" onClick={this.login.bind(this)}>Regístrate</button>
                        <label ref={self => this.submitBtnLabel = self}
                            id="submitBtnLabel" htmlFor="submitBtn"
                            className="shake animated hidden "></label>
                        <p className="alert alert-danger user-est">Crea un usuario o usa el usuario
                        <strong>test/test</strong></p>
                        <p>¿No tienes una cuenta? <Link to="/signup">Registrate</Link> </p> </form>
                </div>
            </div>
        )
    }
}
Login.contextType= UserContext
export default Login
