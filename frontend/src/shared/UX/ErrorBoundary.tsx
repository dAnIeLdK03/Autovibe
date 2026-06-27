import { Component, type ReactNode } from "react";


interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    private handleReset =() => {
        this.setState({hasError: false})
    }   

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 font-sans p-6 md:p-12 pt-20 flex items-center justify-center">
                    <div className="max-w-md w-full bg-slate-800/40 border border-red-500/30 rounded-3xl p-8 text-center backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.05)]">

                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                            Something went <span className="text-red-400">wrong</span>
                        </h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            An unexpected error occurred while rendering this page. Our team has been notified.
                        </p>

                        <button
                            onClick={this.handleReset}
                            className="w-full py-3 px-5 rounded-2xl font-medium text-sm bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white shadow-lg active:scale-[0.98] transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;