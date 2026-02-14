using Autovibe.API.DTOs.Cars;

namespace Autovibe.API.Interfaces;

public interface ICarService
{
    Task<PageResponse<CarListDto>> GetAllAsync(int pageNumber, int pageSize);
    Task<CarDetailsDto?> GetCarDetailsAsync(int id);
    Task<CarDetailsDto?> CreateAsync(CarCreateDto request, int userId);
    Task<CarDetailsDto?> UpdateAsync(int id, CarUpdateDto request, int userId);
    Task DeleteAsync(int id, int userId);
    Task<string> UploadImageAsync(IFormFile file);
}