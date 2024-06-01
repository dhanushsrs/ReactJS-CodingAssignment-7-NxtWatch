import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'

import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  NavigationAndComponentContainer,
  LoaderOrFailureContainer,
  FailureViewImage,
  NotFound,
} from './StyledComponents'

const NotFoundRoute = () => (
  <div>
    <HeaderComponent />
    <NavigationAndComponentContainer>
      <NavigationMenuAsLeftSideBar />

      <NxtWatchContext.Consumer>
        {value => {
          const {lightTheme, changedAttributesOnThemeChange} = value

          const {notFoundImage} = changedAttributesOnThemeChange()
          const {notFoundImageAlt} = changedAttributesOnThemeChange()

          return (
            <LoaderOrFailureContainer theme={lightTheme}>
              <FailureViewImage src={notFoundImage} alt={notFoundImageAlt} />

              <NotFound theme={lightTheme}>Page Not Found</NotFound>

              <NotFound theme={lightTheme} as="p">
                we are sorry, the page you requested could not be found.
              </NotFound>
            </LoaderOrFailureContainer>
          )
        }}
      </NxtWatchContext.Consumer>
    </NavigationAndComponentContainer>
  </div>
)

export default NotFoundRoute
