import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  declare state: State;
  declare setState: (state: State) => void;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-white mb-3">Oops! Something went wrong</h1>
            <p className="text-white/60 mb-2">An unexpected error occurred:</p>
            <p className="text-red-400 font-mono text-sm mb-8 p-4 bg-red-500/10 rounded-lg border border-red-500/30 break-words">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              onClick={this.reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
