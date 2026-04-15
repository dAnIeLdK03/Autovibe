import { LuHeart } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../stores/store";
import { toggleFavorite } from "../../../../stores/favoritesSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Props {
  carId: number;
}

export const FavoriteButton = ({ carId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const isFavorite = useSelector((s: RootState) => s.favorites.ids.includes(carId));

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to save favorites.");
      navigate("/login");
      return;
    }

    dispatch(toggleFavorite({ carId, isFavorite }));
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 transition-transform active:scale-125"
    >
      <LuHeart
        size={28}
        className={`transition-colors duration-300 ${isFavorite
          ? 'fill-red-500 text-red-500'
          : 'text-gray-400 hover:text-gray-200'
          }`}
      />
    </button>

  );
};