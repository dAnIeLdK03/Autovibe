using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Autovibe.API.Extensions;
using Microsoft.AspNetCore.RateLimiting;
using Autovibe.API.Constants;


namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(ICarService carService)
        {
            _carService = carService;
        }

        //GET: api/cars
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PageResponse<CarListDto>>> GetCars([FromQuery] CarFiltersDto request)
        {
            var result = await _carService.GetAllAsync(request);

                result.ThrowIfNull("Unable to load cars.");

            return Ok(result);
        }

        [HttpGet("my-cars")]
        [Authorize]
        public async Task<ActionResult<PageResponse<CarListDto>>> GetMyCars(int pageNumber = 1, int pageSize = 18)
        {

            var userId = User.GetUserId();
            
            userId.ThrowIfNull("Log in first");

            var result = await _carService.GetUserCarsAsync(userId.Value, pageNumber, pageSize);

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<CarDetailsDto>> GetCar(int id)
        {
            id.ThrowIfLessThan(1, "Invalid car id.");

            var result = await _carService.GetCarDetailsAsync(id);

                result.ThrowIfNull("Car cannot be found");

            return Ok(result);
        }

        //POST: api/cars
        [HttpPost]
        public async Task<ActionResult<CarDetailsDto>> CreateCar([FromBody] CarCreateDto createDto)
        {
            var userId = User.GetUserId();

                userId.ThrowIfNull("Log in first");

            var result = await _carService.CreateAsync(createDto, userId.Value);

                result.ThrowIfNull("Unable to create new car");

            return CreatedAtAction(
                nameof(GetCar),
                new {id = result.Id },
                result
            );
        }

        //PUT: api/cars/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CarDetailsDto?>> UpdateCar(int id, [FromBody] CarUpdateDto updateDto)
        {
            var userId = User.GetUserId();

                userId.ThrowIfNull("Log in first");

                id.ThrowIfLessThan(1, "Invalid car id.");

                bool isAdmin = User.IsInRole(AppRoles.Admin);

            var result = await _carService.UpdateAsync(id, updateDto);

                result.ThrowIfNull("Car cannot be found");

            return Ok(result);

        }

        //DELETE: api/cars/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCar(int id)
        {
            var userId = User.GetUserId();

                userId.ThrowIfNull("Unauthorized");

                id.ThrowIfLessThan(1, "Invalid car id.");

                bool isAdmin = User.IsInRole(AppRoles.Admin);

            await _carService.DeleteAsync(id, userId.Value, isAdmin);
            return NoContent();
        }

        //POST: api/cars/upload-image
        [HttpPost("upload-image")]
        [Authorize]
        [EnableRateLimiting("upload")]
        [RequestSizeLimit(5 * 1024 * 1024)]
        public async Task<ActionResult> UploadImage(IFormFile file)
        {
                var imageUrl = await _carService.UploadImageAsync(file);
                return Ok(new { url = imageUrl });
        }
    }
}