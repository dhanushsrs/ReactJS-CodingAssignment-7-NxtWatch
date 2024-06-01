import styled from 'styled-components'

export const LoginPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${props => (props.theme === true ? null : '#0f0f0f')};
`

export const LoginCard = styled.form`
  box-shadow: 0px 0px 5px #00000050;
  border-radius: 15px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  @media screen and (min-width: 768px) {
    min-width: 25%;
    max-width: 30%;
  }
`
export const LogoImage = styled.img`
  width: 250px;
  margin-bottom: 20px;
  @media screen and (min-width: 768px) {
    width: 80%;
  }
`

export const Label = styled.label`
  align-self: flex-start;
  font-size: 14px;
  padding: 0px 20px 15px 0px;
  font-family: Roboto;
  color: ${props => (props.theme === true ? '#616e7c' : '#cccccc')};
  font-weight: 600;
  margin-top: 20px;
  text-align: left;
`

export const InputField = styled.input`
  width: 100%;
  height: 35px;
  padding-left: 10px;
  border: 1px solid;
  border-color: #94a3b8;
  border-radius: 5px;
  margin-top: 5px;
  font-size: 18px;
  margin-bottom: 10px;
  outline: none;
  color: ${props => (props.theme === true ? 'black' : 'white')};
`

export const ShowPassword = styled.label`
  font-weight: 600;
  color: ${props => (props.theme === false ? '#ebebeb' : null)};
`
export const LoginButton = styled.button`
  width: 100%;
  color: #ffffff;
  background-color: #3b82f6;
  padding: 10px;
  border: none;
  outline: none;
  border-radius: 10px;
  margin-top: 20px;
  font-weight: bold;
`
