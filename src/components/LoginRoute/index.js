import {Component} from 'react'

import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  LoginPage,
  LoginCard,
  LogoImage,
  Label,
  InputField,
  ShowPassword,
  LoginButton,
} from './StyledComponents'

import './index.css'

class LoginRoute extends Component {
  state = {
    showPasswordStatus: false,
    username: '',
    password: '',
    showErrorMessage: false,
    errorMessage: '',
  }

  changeShowPasswordStatus = () => {
    this.setState(prevState => ({
      showPasswordStatus: !prevState.showPasswordStatus,
    }))
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMessage: errorMsg, showErrorMessage: true})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  loginCredentialsSubmission = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}

    const apiUrl = 'https://apis.ccbp.in/login'

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {
      showPasswordStatus,
      showErrorMessage,
      errorMessage,
      username,
      password,
    } = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <NxtWatchContext.Consumer>
        {value => {
          const {lightTheme, changedAttributesOnThemeChange} = value

          const passwordInputType = showPasswordStatus ? 'text' : 'password'

          const {watchLogoImage} = changedAttributesOnThemeChange()
          const {watchLogoImageAlt} = changedAttributesOnThemeChange()

          return (
            <LoginPage theme={lightTheme}>
              <LoginCard onSubmit={this.loginCredentialsSubmission}>
                <LogoImage src={watchLogoImage} alt={watchLogoImageAlt} />

                <Label theme={lightTheme} htmlFor="usernameInput">
                  USERNAME
                </Label>
                <InputField
                  type="text"
                  value={username}
                  id="usernameInput"
                  placeholder="Username"
                  onChange={this.changeUsername}
                  theme={lightTheme}
                />

                <Label theme={lightTheme} htmlFor="passwordInput">
                  PASSWORD
                </Label>
                <InputField
                  type={passwordInputType}
                  id="passwordInput"
                  placeholder="Password"
                  onChange={this.changePassword}
                  value={password}
                  theme={lightTheme}
                />

                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="showPasswordInputField"
                    onChange={this.changeShowPasswordStatus}
                  />
                  <ShowPassword
                    htmlFor="showPasswordInputField"
                    theme={lightTheme}
                  >
                    Show Password
                  </ShowPassword>
                </div>
                <LoginButton type="submit">Login</LoginButton>
                {showErrorMessage && <p className="error">*{errorMessage}</p>}
              </LoginCard>
            </LoginPage>
          )
        }}
      </NxtWatchContext.Consumer>
    )
  }
}

export default LoginRoute
