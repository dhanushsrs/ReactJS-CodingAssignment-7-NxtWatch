import {Link} from 'react-router-dom'
import {formatDistanceToNow} from 'date-fns'

import {HiFire} from 'react-icons/hi'
import {GoPrimitiveDot} from 'react-icons/go'

import HeaderComponent from '../HeaderComponent'
import NavigationMenuAsLeftSideBar from '../NavigationMenuAsLeftSideBar'

import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  LoaderOrFailureContainer,
  NoSearchResultsImage,
  NavigationAndSavedPartContainer,
  SavedTopHeadContainer,
  SavedLogo,
  SavedVideoContainer,
  SavedVideoAndDetailsContainer,
  LinkContainer,
  EachVideoThumbnailImage,
  ChannelLogoVideoTitleInformationContainer,
  ChannelLogoImage,
  VideoTitleInformationContainer,
  VideoTitle,
  VideoInformation,
  ChannelTitle,
  ChannelViewAndUpdatedTimeContainer,
  PrimitiveDotChangingScreens,
  ChannesViewsAndUpdatedTime,
  PrimitiveDot,
  TextNoSavedVideos,
  SavedVideosComponentContainer,
  NoSavedVideo,
} from './StyledComponents'

const SavedVideosRoute = () => (
  <div>
    <HeaderComponent />
    <NavigationAndSavedPartContainer>
      <NavigationMenuAsLeftSideBar />
      <NxtWatchContext.Consumer>
        {value => {
          const {lightTheme, savedList} = value

          return (
            <SavedVideosComponentContainer>
              {savedList.length === 0 ? (
                <LoaderOrFailureContainer theme={lightTheme}>
                  <NoSearchResultsImage
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                    alt="no saved videos"
                  />

                  <NoSavedVideo theme={lightTheme}>
                    No saved videos found
                  </NoSavedVideo>

                  <TextNoSavedVideos>
                    You can save your videos while watching them
                  </TextNoSavedVideos>
                </LoaderOrFailureContainer>
              ) : (
                <>
                  <SavedTopHeadContainer theme={lightTheme}>
                    <SavedLogo as={HiFire} />

                    <h1>Saved Videos</h1>
                  </SavedTopHeadContainer>

                  <SavedVideoContainer
                    theme={lightTheme}
                    data-testid="savedVideos"
                  >
                    {savedList.map(eachVideo => {
                      const {
                        thumbnailUrl,
                        channel,
                        viewCount,
                        title,
                        id,
                        publishedAt,
                      } = eachVideo

                      const {name, profileImageUrl} = channel

                      const renderFormateDistanceToNow = publishedAt => {
                        let videoPostedAt = formatDistanceToNow(
                          new Date(publishedAt),
                        )
                        const videoPostedAtList = videoPostedAt.split(' ')

                        if (videoPostedAtList.length === 3) {
                          videoPostedAtList.shift()
                          videoPostedAt = videoPostedAtList.join(' ')
                        }

                        return videoPostedAt
                      }

                      return (
                        <SavedVideoAndDetailsContainer key={id}>
                          <LinkContainer as={Link} to={`/videos/${id}`}>
                            <EachVideoThumbnailImage
                              src={thumbnailUrl}
                              alt="video thumbnail"
                            />

                            <ChannelLogoVideoTitleInformationContainer>
                              <ChannelLogoImage
                                src={profileImageUrl}
                                alt="channel logo"
                              />

                              <VideoTitleInformationContainer>
                                <VideoTitle theme={lightTheme}>
                                  {title}
                                </VideoTitle>

                                <VideoInformation>
                                  <ChannelTitle theme={lightTheme}>
                                    {name}
                                  </ChannelTitle>

                                  <ChannelViewAndUpdatedTimeContainer>
                                    <PrimitiveDotChangingScreens
                                      as={GoPrimitiveDot}
                                    />

                                    <ChannesViewsAndUpdatedTime>
                                      {viewCount} views
                                    </ChannesViewsAndUpdatedTime>

                                    <PrimitiveDot as={GoPrimitiveDot} />

                                    <ChannesViewsAndUpdatedTime>
                                      {/* publishedAt */}
                                      <p>
                                        {renderFormateDistanceToNow(
                                          publishedAt,
                                        )}{' '}
                                        ago
                                      </p>
                                    </ChannesViewsAndUpdatedTime>
                                  </ChannelViewAndUpdatedTimeContainer>
                                </VideoInformation>
                              </VideoTitleInformationContainer>
                            </ChannelLogoVideoTitleInformationContainer>
                          </LinkContainer>
                        </SavedVideoAndDetailsContainer>
                      )
                    })}
                  </SavedVideoContainer>
                </>
              )}
            </SavedVideosComponentContainer>
          )
        }}
      </NxtWatchContext.Consumer>
    </NavigationAndSavedPartContainer>
  </div>
)

export default SavedVideosRoute
