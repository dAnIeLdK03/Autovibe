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
using Autovibe.API.Extensions;
using Autovibe.API.Exceptions;


namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarsController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarsController( ICarService carService)
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
             throw new NotFoundException("No cars found.");   
            }

            return Ok(new PageResponse<CarListDto>
            {
                Items = result.Items,
                TotalPages = result.TotalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        [HttpGet("my-cars")]
        [Authorize]
        public async Task<ActionResult<PageResponse<CarListDto>>> GetMyCars(int pageNumber = 1, int pageSize = 9)
        {
            
            var userId = User.GetUserId();
            if(userId == null)
            {
                throw new UnauthorizedException("Unauthorized");
            }
            var result = await _carService.GetUserCarsAsync(userId.Value, pageNumber, pageSize);

            return Ok(result);        
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<CarDetailsDto>> GetCar(int id)
        {
           
            var result = await _carService.GetCarDetailsAsync(id);
            if(result == null)
            {
               throw new NotFoundException("Car not found.");  
            }

            
            return Ok(result);
        }

        //POST: api/cars
        [HttpPost]
        public async Task<ActionResult<CarCreateDto>> CreateCar([FromBody] CarCreateDto createDto)
        {
            var userId = User.GetUserId();
            if(userId == null)
            {
                throw new UnauthorizedException("Unauthorized");
            }
            var result = await _carService.CreateAsync(createDto, userId.Value);
            if(result == null)
            {
                throw new BadRequestException("Failed to create car.");
            }

            return Ok(result);
        }

        //PUT: api/cars/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CarUpdateDto?>> UpdateCar(int id, [FromBody] CarUpdateDto updateDto)
        {
            var userId = User.GetUserId();
            if(userId == null)
            {
                throw new UnauthorizedException("Unauthorized");
            }
            var result = await _carService.UpdateAsync(id, updateDto, userId.Value);

            if (result == null)
            {
                throw new NotFoundException("Car not found or you do not have permission to update this car." );
            }

            return Ok(result);
            
        }

        //DELETE: api/cars/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCar(int id)
        {
            var userId = User?.GetUserId();
            if(userId == null)
            {
                throw new UnauthorizedException("Unauthorized");
            }
            await _carService.DeleteAsync(id, userId.Value);
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
            }catch(ArgumentException)
            {
               throw new BadRequestException("Invalid file type. Only images are allowed.");
            }catch(Exception)
            {
                throw new InternalException("Failed to upload image.");
            }
        }
    }
}