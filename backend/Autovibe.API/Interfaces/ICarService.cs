using Autovibe.API.DTOs.Cars;

namespace Autovibe.API.Interfaces;

public interface ICarService
{
    Task<PageResponse<CarListDto>> GetAllAsync(CarFiltersDto request);
    Task<CarDetailsDto?> GetCarDetailsAsync(int id);
    Task<CarDetailsDto?> CreateAsync(CarUpdateDto request, int userId);
    Task<CarDetailsDto?> UpdateAsync(int id, CarUpdateDto requesta, int userId, bool isAdmin);
    Task<bool> DeleteAsync(int id, int userId, bool isAdmin);
    Task<PageResponse<CarListDto>> GetUserCarsAsync(int userId, int pageNumber, int pageSize);
}