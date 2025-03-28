import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the child component tree
 * and display a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state so the next render will show the fallback UI
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Catch errors in any components below and re-render with error message
   */
  componentDidCatch(error, errorInfo) {
    // Log error to console or error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // You could also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  /**
   * Reset the error state
   */
  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function' 
          ? this.props.fallback(this.state.error, this.handleReset)
          : this.props.fallback;
      }
      
      return (
        <div className="error-boundary p-6 m-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Something went wrong
          </h2>
          <div className="text-red-700 mb-4">
            {this.state.error && this.state.error.toString()}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
          {this.props.showDetails && this.state.errorInfo && (
            <details className="mt-4 text-left bg-white p-4 rounded border border-gray-300">
              <summary className="font-semibold cursor-pointer">Error Details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
  showDetails: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  fallback: null,
  showDetails: process.env.NODE_ENV === 'development'
};

export default ErrorBoundary;