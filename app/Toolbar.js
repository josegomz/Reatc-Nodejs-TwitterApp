import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

class Toolbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    logout(e) {
        e.preventDefault()
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("username")
        window.location = '/login';
    }

    render() {

        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <span className="visible-xs bs-test">XS</span>
                <span className="visible-sm bs-test">SM</span>
                <span className="visible-md bs-test">MD</span>
                <span className="visible-lg bs-test">LG</span>

                <div className="container-fluid">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link className="navbar-brand" to="/">
                                <i className="fa fa-twitter" aria-hidden="true" />
                            </Link>
                            <ul id="menu">
                                <li id="tbHome" className="selected">
                                    <Link to="/">
                                        <p className="menu-item">
                                            <i className="fa fa-home menu-item-icon" aria-hidden="true" />
                                            <span className="hidden-xs hidden-sm">Inicio</span>
                                        </p>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <If condition={this.props.profile != null} >
                            <ul className="nav navbar-nav navbar-right">
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                        <img className="navbar-avatar" src={this.props.profile.avatar} alt={this.props.profile.userName} />
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <Link to={`/${this.props.profile.userName}`}>
                                                Ver perfil</Link>
                                        </li>
                                        <li role="separator" className="divider"></li>
                                        <li>
                                            <Link to="#" onClick={this.logout.bind(this)}>
                                                Cerrar sesión</Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </If>
                    </div>
                </div>
            </nav>
        )
    }
}
Toolbar.propTypes = {
    profile: PropTypes.object
}
export default Toolbar