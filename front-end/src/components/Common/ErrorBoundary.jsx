import { Component } from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            p: 3,
          }}
        >
          <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              An unexpected error occurred. Please try again.
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleRetry}
              sx={{ mt: 2 }}
            >
              Reload Application
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary