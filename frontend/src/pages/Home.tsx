import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../stores/store';

function Home() {
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);


  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwIDMuMzE0LTIuNjg2IDYtNiA2cy02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIGZpbGw9IiM3MEZGRkUyIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
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

        {/* CTA Бутони */}
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
                Разгледайте колите
              </button>
              <button
                onClick={() => navigate('/cars/my')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg rounded-xl border-2 border-slate-600 hover:border-[#70FFE2] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                Моите коли
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
