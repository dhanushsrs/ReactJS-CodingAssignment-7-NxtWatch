import {Component} from 'react'
import {Link} from 'react-router-dom'
import {formatDistanceToNow} from 'date-fns'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {GoPrimitiveDot} from 'react-icons/go'
import {HiFire} from 'react-icons/hi'

import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'
import FailureViewComponent from '../FailureViewComponent'

import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  NavigationAndTrendingPartContainer,
  LoaderOrFailureContainer,
  TrendingComponentContainer,
  LoaderComponent,
  TrendingTopHeadContainer,
  TrendingLogo,
  TrendingVideoAndDetailsContainer,
  TrendingsContainer,
  EachVideoThumbnailImage,
  LinkContainer,
  ChannelLogoVideoTitleInformationContainer,
  ChannelLogoImage,
  VideoTitleInformationContainer,
  VideoTitle,
  VideoInformation,
  ChannelTitle,
  ChannesViewsAndUpdatedTime,
  PrimitiveDotChangingScreens,
  PrimitiveDot,
  ChannelViewAndUpdatedTimeContainer,
} from './StyledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
}

class TrendingRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    listOfVideosDetails: [],
  }

  componentDidMount = () => {
    this.getListOfVideosData()
  }

  getListOfVideosData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/trending'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.videos.map(eachData => ({
        id: eachData.id,
        publishedAt: eachData.published_at,
        thumbnailUrl: eachData.thumbnail_url,
        title: eachData.title,
        viewCount: eachData.view_count,
        channel: {
          name: eachData.channel.name,
          profileImageUrl: eachData.channel.profile_image_url,
        },
      }))

      this.setState({
        listOfVideosDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFormateDistanceToNow = publishedAt => {
    let videoPostedAt = formatDistanceToNow(new Date(publishedAt))
    const videoPostedAtList = videoPostedAt.split(' ')

    if (videoPostedAtList.length === 3) {
      videoPostedAtList.shift()
      videoPostedAt = videoPostedAtList.join(' ')
    }

    return videoPostedAt
  }

  renderTrendingVideoDetails = lightTheme => {
    const {listOfVideosDetails} = this.state

    return (
      <div>
        <TrendingTopHeadContainer theme={lightTheme}>
          <TrendingLogo as={HiFire} />
          <h1>Trending</h1>
        </TrendingTopHeadContainer>

        <TrendingsContainer theme={lightTheme} data-testid="trending">
          {listOfVideosDetails.map(eachVideo => {
            const {channel} = eachVideo

            return (
              <TrendingVideoAndDetailsContainer key={eachVideo.id}>
                <LinkContainer as={Link} to={`/videos/${eachVideo.id}`}>
                  <EachVideoThumbnailImage
                    src={eachVideo.thumbnailUrl}
                    alt="video thumbnail"
                  />

                  <ChannelLogoVideoTitleInformationContainer>
                    <ChannelLogoImage
                      src={channel.profileImageUrl}
                      alt="channel logo"
                    />

                    <VideoTitleInformationContainer>
                      <VideoTitle theme={lightTheme}>
                        {eachVideo.title}
                      </VideoTitle>

                      <VideoInformation>
                        <ChannelTitle>{channel.name}</ChannelTitle>

                        <ChannelViewAndUpdatedTimeContainer>
                          <PrimitiveDotChangingScreens as={GoPrimitiveDot} />

                          <ChannesViewsAndUpdatedTime>
                            {eachVideo.viewCount} views
                          </ChannesViewsAndUpdatedTime>

                          <PrimitiveDot as={GoPrimitiveDot} />

                          <ChannesViewsAndUpdatedTime>
                            {/* eachVideo.publishedAt */}
                            <p>
                              {this.renderFormateDistanceToNow(
                                eachVideo.publishedAt,
                              )}{' '}
                              ago
                            </p>
                          </ChannesViewsAndUpdatedTime>
                        </ChannelViewAndUpdatedTimeContainer>
                      </VideoInformation>
                    </VideoTitleInformationContainer>
                  </ChannelLogoVideoTitleInformationContainer>
                </LinkContainer>
              </TrendingVideoAndDetailsContainer>
            )
          })}
        </TrendingsContainer>
      </div>
    )
  }

  failureView = lightTheme => (
    <LoaderOrFailureContainer theme={lightTheme}>
      <FailureViewComponent retryFunction={this.getListOfVideosData} />
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
        return this.renderTrendingVideoDetails(lightTheme)
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
        <NavigationAndTrendingPartContainer>
          <NavigationMenuAsLeftSideBar />
          <NxtWatchContext.Consumer>
            {value => {
              const {lightTheme} = value

              return (
                <TrendingComponentContainer>
                  {this.checkApiStatus(lightTheme)}
                </TrendingComponentContainer>
              )
            }}
          </NxtWatchContext.Consumer>
        </NavigationAndTrendingPartContainer>
      </div>
    )
  }
}

export default TrendingRoute
