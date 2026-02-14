using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using System.Reflection.Metadata;

namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController(AppDbContext context, ICarService carService)
        {
            _carService = carService;
        }

        //GET: api/cars
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PageResponse<CarListDto>>> GetCars(int pageNumber = 1, int pageSize = 10)
        {
            var result = await _carService.GetAllAsync(pageNumber, pageSize);
            if(result == null)
            {
                return NotFound(new { message = "No cars found." });
            }

            return Ok(new PageResponse<CarListDto>
            {
                Items = result.Items,
                TotalPages = result.TotalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<CarDetailsDto>> GetCar(int id)
        {
           
            var result = await _carService.GetCarDetailsAsync(id);
            if(result == null)
            {
                return NotFound(new { message = "Car not found." });
            }

            
            return Ok(result);
        }

        //POST: api/cars
        [HttpPost]
        public async Task<ActionResult<CarCreateDto>> CreateCar([FromBody] CarCreateDto createDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

            var result = await _carService.CreateAsync(createDto, userId);
            if(result == null)
            {
                return BadRequest(new { message = "Failed to create car." });
            }

            return Ok(result);
        }

        //PUT: api/cars/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CarUpdateDto?>> UpdateCar(int id, [FromBody] CarUpdateDto updateDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

            var result = await _carService.UpdateAsync(id, updateDto, userId);

            if (result == null)
            {
                return NotFound(new { message = "Car not found or you do not have permission to update this car." });
            }

            return Ok(result);
            
        }

        //DELETE: api/cars/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCar(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
            await _carService.DeleteAsync(id, userId);
            return NoContent();
        }

        //POST: api/cars/upload-image
        [HttpPost("upload-image")]
        [Authorize]
        public async Task<ActionResult> UploadImage(IFormFile file)
        {
            try
            {
                var imageUrl = await _carService.UploadImageAsync(file);
                return Ok(new { url = imageUrl });
            }catch(ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }catch(Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while uploading the image.", details = ex.Message });
            }
        }
    }
}