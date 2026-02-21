import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-900 font-sans flex items-center justify-center h-[calc(100vh-64px)] w-full overflow-hidden">
            
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-lg">
                <img 
                    src="/sad.png"
                    alt="NotFound"
                    className="w-32 h-32 md:w-40 md:h-40 object-contain mb-6 animate-pulse"
                />
                
                <h1 className="text-7xl font-black text-white tracking-tighter mb-2">404</h1>
                <h2 className="text-2xl font-bold text-white mb-4">Page not found</h2>
                
                <p className="text-slate-400 text-lg mb-10">
                    Oops! This route does not appear to exist. The engine is running, but the address is incorrect.
                </p>

                <button 
                    className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-blue-500/40 flex items-center gap-2 group"
                    onClick={() => navigate("/cars")}
                >
                    🡰 Back
                </button>
            </div>
            
        </div>
    );
}

export default NotFound;