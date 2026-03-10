import { Link } from "react-router"

function EmptyState() {
  
  return (
     <div className="flex flex-col items-center justify-top h-screen text-center bg-slate-900">
        <div className="bg-gray-100 rounded-full m-5 bg-slate-600">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24 ">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-600">No cars yet</h2>
        <p className="text-gray-500 mt-2">Add one by clicking the Link bellow.</p>
        <Link
              to="/cars/new"
              className="text-[#70FFE2] font-bold hover:text-white transition-colors duration-200 m-5"
            >
              Add new
        </Link>
        
      </div>
  )
}

export default EmptyState