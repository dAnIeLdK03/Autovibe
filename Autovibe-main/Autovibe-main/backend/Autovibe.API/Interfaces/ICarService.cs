
namespace Autovibe.API.Interfaces;

public interface ICarService
{
    Task<IEnumerable<CarResponseDto>> GetAllAsync();
    Task<CarResponseDto?> GetByIdAsync(int id);
    Task<CarResponseDto> CreateAsync(CreateCarRequestDto request, int userId);
    Task<CarResponseDto> UpdateAsync(int id, UpdateCarRequestDto request, int userId);
    Task DeleteAsync(int id, int userId);
}