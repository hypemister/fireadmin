import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import { withContext } from 'recompose'
import { MuiThemeProvider, createMuiTheme } from 'material-ui-next/styles'

// Themeing/Styling
import Theme from 'theme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const theme = createMuiTheme(Theme)

const App = ({ routes, store }) => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Router history={browserHistory}>{routes}</Router>
    </MuiThemeProvider>
  </Provider>
)

App.propTypes = {
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

export default withContext(
  {
    muiTheme: PropTypes.object
  },
  () => ({
    muiTheme: getMuiTheme(Theme)
  })
)(App)
