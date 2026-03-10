import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../stores/store';

function Home() {
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);


  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden h-[calc(100vh-64px)]">
      <div className=" inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
          Find the perfect{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#70FFE2]">
            CAR
          </span>{' '}
          for you
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Autovibe - Your journey to the perfect car. Browse our collection of high-quality vehicles at affordable prices.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/cars')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-[#70FFE2] hover:from-blue-700 hover:to-[#5ee6cb] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                 Look around
              </button>
             
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/cars')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-[#70FFE2] hover:from-blue-700 hover:to-[#5ee6cb] text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Browse Cars
              </button>
            </>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
}

export default Home
