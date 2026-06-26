namespace Autovibe.API.Interfaces;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file);
}