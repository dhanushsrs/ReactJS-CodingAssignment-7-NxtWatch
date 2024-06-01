import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {formatDistanceToNow} from 'date-fns'
import Loader from 'react-loader-spinner'

import {GrFormClose} from 'react-icons/gr'
import {BsSearch} from 'react-icons/bs'
import {GoPrimitiveDot} from 'react-icons/go'

import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'

import FailureViewComponent from '../FailureViewComponent'

import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  NavigationSideBarHomeComponentContainer,
  HomeComponentContainer,
  BannerContainer,
  BannerContentsContainer,
  BannerNxtWatchLogo,
  BannerText,
  GetItNowBannerButton,
  BannerCloseButton,
  HomeComponent,
  SearchInputField,
  SearchButton,
  SearchFieldContainer,
  LoaderOrFailureContainer,
  LoaderComponent,
  NoSearchResultsImage,
  NoSearchResultsText,
  TryDifferentText,
  RetryButton,
  SearchResultsContainer,
  EachVideoThumbnailContainer,
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
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class HomeRoute extends Component {
  state = {
    showBanner: true,
    searchInput: '',
    listOfVideosDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getListOfVideosData()
  }

  getListOfVideosData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchInput} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/all?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    // console.log(data)

    if (response.ok === true) {
      const updatedData = data.videos.map(eachItem => ({
        id: eachItem.id,
        channel: {
          name: eachItem.channel.name,
          profileImageUrl: eachItem.channel.profile_image_url,
        },
        publishedAt: eachItem.published_at,
        thumbnailUrl: eachItem.thumbnail_url,
        title: eachItem.title,
        viewCount: eachItem.view_count,
      }))
      this.setState({
        listOfVideosDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
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

  renderListOfVideosDetails = lightTheme => {
    const {listOfVideosDetails} = this.state

    return (
      <>
        {listOfVideosDetails.length === 0 ? (
          <LoaderOrFailureContainer theme={lightTheme}>
            <NoSearchResultsImage
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
              alt="no videos"
            />

            <NoSearchResultsText theme={lightTheme}>
              No Search Results Found
            </NoSearchResultsText>

            <TryDifferentText>
              Try different key words or remove search filter
            </TryDifferentText>

            <RetryButton type="button" onClick={this.getListOfVideosData}>
              Retry
            </RetryButton>
          </LoaderOrFailureContainer>
        ) : (
          <SearchResultsContainer>
            {listOfVideosDetails.map(eachVideo => {
              const {channel} = eachVideo

              return (
                <EachVideoThumbnailContainer key={eachVideo.id}>
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
                </EachVideoThumbnailContainer>
              )
            })}
          </SearchResultsContainer>
        )}
      </>
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
        return this.renderListOfVideosDetails(lightTheme)
      case apiStatusConstants.failure:
        return this.failureView(lightTheme)
      case apiStatusConstants.inProgress:
        return this.loader(lightTheme)

      default:
        return null
    }
  }

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  closeBanner = () => {
    this.setState({showBanner: false})
  }

  render() {
    const {showBanner, searchInput} = this.state

    return (
      <div>
        <HeaderComponent />
        <NavigationSideBarHomeComponentContainer>
          <NavigationMenuAsLeftSideBar />
          <NxtWatchContext.Consumer>
            {value => {
              const {lightTheme} = value

              return (
                <HomeComponentContainer>
                  {showBanner && (
                    <BannerContainer data-testid="banner">
                      <BannerContentsContainer>
                        <BannerNxtWatchLogo
                          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                          alt="nxt watch logo"
                        />

                        <BannerText>
                          Buy Nxt Watch Premium prepaid plans with UPI
                        </BannerText>

                        <GetItNowBannerButton type="button">
                          GET IT NOW
                        </GetItNowBannerButton>
                      </BannerContentsContainer>

                      <div>
                        <BannerCloseButton
                          type="button"
                          data-tesid="close"
                          onClick={this.closeBanner}
                        >
                          <GrFormClose />
                        </BannerCloseButton>
                      </div>
                    </BannerContainer>
                  )}

                  <HomeComponent data-testid="home" theme={lightTheme}>
                    <SearchFieldContainer>
                      <SearchInputField
                        type="search"
                        placeholder="Search"
                        onChange={this.updateSearchInput}
                        value={searchInput}
                        theme={lightTheme}
                      />
                      <SearchButton
                        type="button"
                        data-testid="searchButton"
                        onClick={this.getListOfVideosData}
                        theme={lightTheme}
                      >
                        <BsSearch />
                      </SearchButton>
                    </SearchFieldContainer>

                    <>{this.checkApiStatus(lightTheme)}</>
                  </HomeComponent>
                </HomeComponentContainer>
              )
            }}
          </NxtWatchContext.Consumer>
        </NavigationSideBarHomeComponentContainer>
      </div>
    )
  }
}

export default HomeRoute
