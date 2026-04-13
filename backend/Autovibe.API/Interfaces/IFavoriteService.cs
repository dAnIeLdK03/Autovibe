

using Autovibe.API.DTOs.Cars;

namespace Autovibe.API.Interfaces;

public interface IFavoriteService
{
    Task AddAsync(int userId, int carId);

    Task RemoveAsync(int userId, int carId);

    Task<PageResponse<CarListDto>> GetPageAsync(int userId, int pageNumber, int pageSize);

    Task<bool> IsFavorite(int userId, int carId);

}