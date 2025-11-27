import React from 'react';

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Optional: Send to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4 z-50">
          <div className="glass rounded-2xl border border-slate-700 p-8 max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Something Went Wrong
            </h1>
            
            <p className="text-slate-300 mb-4">
              We encountered an unexpected error. Here's what happened:
            </p>

            {/* Error Message */}
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4 text-left">
              <p className="text-sm text-red-200 font-mono break-words">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-300 text-sm">
                  📋 Error Details (Dev Only)
                </summary>
                <pre className="mt-2 bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Return to Home
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                Reload Page
              </button>
            </div>

            {/* Error Count Warning */}
            {this.state.errorCount > 3 && (
              <p className="text-xs text-orange-400 mt-4">
                ⚠️ Multiple errors detected. Try clearing browser cache or contact support.
              </p>
            )}

            {/* Tips */}
            <div className="mt-6 pt-4 border-t border-slate-700 text-left">
              <p className="text-xs text-slate-400 font-semibold mb-2">💡 Troubleshooting:</p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• Clear your browser cache and cookies</li>
                <li>• Try a different browser</li>
                <li>• Check your internet connection</li>
                <li>• Make sure JavaScript is enabled</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
