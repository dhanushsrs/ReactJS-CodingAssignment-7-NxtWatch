import NxtWatchContext from '../../Context/NxtWatchContext'

import {
  FailureViewImage,
  FailureTextSomethingWentWrong,
  HavingTroubleText,
  RetryButton,
} from './StyledComponents'

const FailureViewComponent = props => {
  const {retryFunction} = props

  const retry = () => {
    retryFunction()
  }

  return (
    <NxtWatchContext.Consumer>
      {value => {
        const {lightTheme, changedAttributesOnThemeChange} = value

        const {failureViewImage} = changedAttributesOnThemeChange()
        const {failureViewImageAlt} = changedAttributesOnThemeChange()

        return (
          <>
            <FailureViewImage
              theme={lightTheme}
              src={failureViewImage}
              alt={failureViewImageAlt}
            />

            <FailureTextSomethingWentWrong theme={lightTheme}>
              Oops! Something Went Wrong
            </FailureTextSomethingWentWrong>

            <HavingTroubleText>
              We are having some trouble to complete your request. Please try
              again.
            </HavingTroubleText>

            <RetryButton type="button" onclick={retry}>
              Retry
            </RetryButton>
          </>
        )
      }}
    </NxtWatchContext.Consumer>
  )
}

export default FailureViewComponent
