import {Component} from 'react'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {SiYoutubegaming} from 'react-icons/si'

import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'
import FailureViewComponent from '../FailureViewComponent'

import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  NavigationSideBarComponentContainer,
  LoaderComponent,
  LoaderOrFailureContainer,
  GameComponent,
  GamingLogo,
  GamingTopHeadContainer,
  GamingContainer,
  GamingVideoAndDetailsContainer,
  LinkContainer,
  EachVideoThumbnailImage,
  TitleGame,
  GameDetails,
} from './StyledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GamingRoute extends Component {
  state = {
    listOfGamesDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getListOfGamesData()
  }

  getListOfGamesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/gaming'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const updatedData = data.videos.map(eachVideo => ({
        id: eachVideo.id,
        thumbnailUrl: eachVideo.thumbnail_url,
        title: eachVideo.title,
        viewCount: eachVideo.view_count,
      }))
      this.setState({
        listOfGamesDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderGamingVideoDetails = lightTheme => {
    const {listOfGamesDetails} = this.state

    return (
      <>
        <GamingTopHeadContainer theme={lightTheme}>
          <GamingLogo as={SiYoutubegaming} />
          <h1>Gaming</h1>
        </GamingTopHeadContainer>

        <GamingContainer data-testid="gaming" theme={lightTheme}>
          {listOfGamesDetails.map(eachVideo => (
            <GamingVideoAndDetailsContainer
              theme={lightTheme}
              key={eachVideo.id}
            >
              <LinkContainer as={Link} to={`/videos/${eachVideo.id}`}>
                <EachVideoThumbnailImage
                  src={eachVideo.thumbnailUrl}
                  alt="video thumbnail"
                />

                <TitleGame theme={lightTheme}>{eachVideo.title}</TitleGame>

                <GameDetails>{eachVideo.viewCount} Watching</GameDetails>

                <GameDetails>Worldwide</GameDetails>
              </LinkContainer>
            </GamingVideoAndDetailsContainer>
          ))}
        </GamingContainer>
      </>
    )
  }

  failureView = lightTheme => (
    <LoaderOrFailureContainer theme={lightTheme}>
      <FailureViewComponent retryFunction={this.getListOfGamesData} />
    </LoaderOrFailureContainer>
  )

  loader = lightTheme => (
    <LoaderOrFailureContainer data-testid="loader" theme={lightTheme}>
      <LoaderComponent
        as={Loader}
        type="ThreeDots"
        color="#4f46e5"
        height="50"
        width="50"
      />
    </LoaderOrFailureContainer>
  )

  checkApiStatus = lightTheme => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderGamingVideoDetails(lightTheme)
      case apiStatusConstants.failure:
        return this.failureView(lightTheme)
      case apiStatusConstants.inProgress:
        return this.loader(lightTheme)

      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <HeaderComponent />
        <NavigationSideBarComponentContainer>
          <NavigationMenuAsLeftSideBar />

          <NxtWatchContext.Consumer>
            {value => {
              const {lightTheme} = value

              return (
                <GameComponent>{this.checkApiStatus(lightTheme)}</GameComponent>
              )
            }}
          </NxtWatchContext.Consumer>
        </NavigationSideBarComponentContainer>
      </div>
    )
  }
}

export default GamingRoute
