import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <details className="bg-slate-100 rounded-lg p-4 mb-4">
              <summary className="cursor-pointer font-medium text-slate-700">Error Details</summary>
              <pre className="mt-2 text-xs text-red-600 overflow-auto whitespace-pre-wrap">
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre className="mt-2 text-xs text-slate-600 overflow-auto whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
