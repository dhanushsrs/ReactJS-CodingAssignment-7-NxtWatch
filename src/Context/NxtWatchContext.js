import React from 'react'

const NxtWatchContext = React.createContext({
  lightTheme: true,
  likedList: [],
  dislikedList: [],
  savedList: [],
  changeTheme: () => {},
  changedAttributesOnThemeChange: () => {},
  addAsLikedVideos: () => {},
  addAsDislikedVideos: () => {},
  addOrRemoveFromSavedVideos: () => {},
})

export default NxtWatchContext
