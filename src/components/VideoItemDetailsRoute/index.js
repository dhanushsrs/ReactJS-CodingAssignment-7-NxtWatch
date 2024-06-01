import {Component} from 'react'
import Cookies from 'js-cookie'

import ReactPlayer from 'react-player'
import Loader from 'react-loader-spinner'
import {formatDistanceToNow} from 'date-fns'

import {GoPrimitiveDot} from 'react-icons/go'
import {BiLike, BiDislike, BiListPlus} from 'react-icons/bi'

import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'
import FailureViewComponent from '../FailureViewComponent'
import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  LoaderOrFailureContainer,
  LoaderComponent,
  NavigationAndTrendingPartContainer,
  TrendingVideoAndDetailsContainer,
  TrendingComponentContainer,
  EachVideoThumbnailImage,
  VideoTitle,
  VideoDetailsOptionsContainers,
  ViewsAndUpdatedTimeContainer,
  HorizontalRule,
  ChannelDetailsContainer,
  ChannelImage,
  PrimitiveDot,
  CustomizeButton,
  ButtonContainer,
  ChannelTitle,
  ChannelSubscriber,
} from './StyledComponents'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class VideoItemDetailsRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    videoDetails: {},
  }

  componentDidMount = () => {
    this.getVideoData()
  }

  getVideoData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/${id}`
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
      const formatedData = {
        videoDetails: data.video_details,
      }

      const {videoDetails} = formatedData
      const updatedData = {
        id: videoDetails.id,
        description: videoDetails.description,
        publishedAt: videoDetails.published_at,
        thumbnailUrl: videoDetails.thumbnail_url,
        title: videoDetails.title,
        videoUrl: videoDetails.video_url,
        viewCount: videoDetails.view_count,
        channel: {
          name: videoDetails.channel.name,
          profileImageUrl: videoDetails.channel.profile_image_url,
          subscriberCount: videoDetails.channel.subscriber_count,
        },
      }
      this.setState({
        videoDetails: updatedData,
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

  renderVideoItemDetails = lightTheme => {
    const {videoDetails} = this.state

    const {publishedAt, title, videoUrl, viewCount} = videoDetails
    const {channel, description, id} = videoDetails

    const {name, profileImageUrl, subscriberCount} = channel

    return (
      <TrendingVideoAndDetailsContainer>
        <EachVideoThumbnailImage
          as={ReactPlayer}
          url={videoUrl}
          controls
          width="100%"
          height="70vh"
        />

        <VideoTitle theme={lightTheme}>{title}</VideoTitle>

        <VideoDetailsOptionsContainers>
          <ViewsAndUpdatedTimeContainer>
            <p>{viewCount} Views</p>

            <PrimitiveDot as={GoPrimitiveDot} />

            <p>{this.renderFormateDistanceToNow(publishedAt)} ago </p>
          </ViewsAndUpdatedTimeContainer>

          <NxtWatchContext.Consumer>
            {value => {
              const {
                likedList,
                dislikedList,
                savedList,
                addAsLikedVideos,
                addAsDislikedVideos,
                addOrRemoveFromSavedVideos,
              } = value

              {
                /* Assume votesValue as isLiked or isDisliked */
              }

              const savedListIds = savedList.map(each => each.id)

              const saveButtonText = savedListIds.includes(id)
                ? 'Saved'
                : 'Save'

              const toSaveOrUnSave = () => {
                addOrRemoveFromSavedVideos(videoDetails)
              }

              const addToDisLiked = () => {
                addAsDislikedVideos(id)
              }

              const addToLiked = () => {
                addAsLikedVideos(id)
              }

              return (
                <ButtonContainer>
                  <CustomizeButton
                    type="button"
                    onClick={addToLiked}
                    votesValue={likedList.includes(id)}
                  >
                    <BiLike /> Like
                  </CustomizeButton>

                  <CustomizeButton
                    type="button"
                    onClick={addToDisLiked}
                    votesValue={dislikedList.includes(id)}
                  >
                    <BiDislike /> Dislike
                  </CustomizeButton>

                  <CustomizeButton
                    type="button"
                    onClick={toSaveOrUnSave}
                    votesValue={savedListIds.includes(id)}
                  >
                    <BiListPlus /> {saveButtonText}
                  </CustomizeButton>
                </ButtonContainer>
              )
            }}
          </NxtWatchContext.Consumer>
        </VideoDetailsOptionsContainers>

        <HorizontalRule />

        <ChannelDetailsContainer>
          <ChannelImage src={profileImageUrl} alt="channel logo" />

          <div>
            <ChannelTitle theme={lightTheme}>{name}</ChannelTitle>

            <ChannelSubscriber>{subscriberCount} subscribers</ChannelSubscriber>

            <ChannelSubscriber>{description}</ChannelSubscriber>
          </div>
        </ChannelDetailsContainer>
      </TrendingVideoAndDetailsContainer>
    )
  }

  failureView = lightTheme => (
    <LoaderOrFailureContainer theme={lightTheme}>
      <FailureViewComponent retryFunction={this.getVideoData} />
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
        return this.renderVideoItemDetails(lightTheme)
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
                <TrendingComponentContainer
                  data-testid="videoItemDetails"
                  theme={lightTheme}
                >
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

export default VideoItemDetailsRoute
