
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Interfaces;

namespace Autovibe.API.Services
{

    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;
        public ImageService(IWebHostEnvironment env)
        {
            _env = env;
        }
        public async Task<string> UploadImageAsync(IFormFile file)
        {
           file.ThrowIfNull("File is null or empty.");

            const long maxFileSize = 5 * 1024 * 1024; // 5MB            
            file.ThrowIfTooLarge(maxFileSize, "File size exceeds the maximum allowed size of 5MB.");


            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            file.ThrowIfFileIsWrongFormat(allowed);

            string serverPath = Path.Combine(_env.WebRootPath, "images", "cars");
            serverPath.EnsureDirectoryExists();

            file.ThrowIfImageIsInvalid();

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(serverPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/images/cars/{fileName}";
        }
    }
}