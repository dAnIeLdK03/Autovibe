
using Autovibe.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        //POST: api/images/upload-image
        [HttpPost("upload-image")]
        [Authorize]
        [EnableRateLimiting("upload")]
        [RequestSizeLimit(5 * 1024 * 1024)]
        public async Task<ActionResult> UploadImage(IFormFile file)
        {
            var imageUrl = await _imageService.UploadImageAsync(file);
            return Ok(new { url = imageUrl });
        }
    }
}