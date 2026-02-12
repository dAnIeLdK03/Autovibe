using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CarsController : ControllerBase
    {
        private readonly AppDbContext _context;

        //contructor
        public CarsController(AppDbContext context)
        {
            _context = context;
        }

        //GET: api/cars
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<PageResponse<CarListDto>>> GetCars(int pageNumber = 1, int pageSize = 10)
        {
            if(pageNumber < 1) pageNumber = 1;
            var query = _context.Cars.AsQueryable();
            var totalItems = await query.CountAsync();

            var cars = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CarListDto
            {
                Id = c.Id,
                Make = c.Make,
                Model = c.Model,
                Year = c.Year,
                Price = c.Price,
                Mileage = c.Mileage,
                FuelType = c.FuelType,
                Transmission = c.Transmission,
                Color = c.Color,
                ShortDescription = c.Description != null && c.Description.Length > 100
                ? c.Description.Substring(0, 100) + "..."
                : c.Description,
                UserId = c.UserId,
                ImageUrls = c.ImageUrls ?? new List<string>()
            }).ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalItems / pageSize);


            return Ok(new PageResponse<CarListDto>
            {
                Items = cars,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize
            });
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<CarDetailsDto>> GetCar(int id)
        {
            var car = await _context.Cars
                 .Include(c => c.User)
                 .FirstOrDefaultAsync(c => c.Id == id);

            if (car == null)
            {
                return NotFound();
            }

            var carDetails = new CarDetailsDto
            {
                Id = car.Id,
                Make = car.Make,
                Model = car.Model,
                Year = car.Year,
                Price = car.Price,
                Mileage = car.Mileage,
                FuelType = car.FuelType,
                Transmission = car.Transmission,
                Color = car.Color,
                Description = car.Description,
                CreatedAt = car.CreatedAt,
                UpdatedAt = car.UpdatedAt,

                SellerId = car.UserId,
                SellerFirstName = car.User.FirstName,
                SellerLastName = car.User.LastName,
                SellerPhoneNumber = car.User.PhoneNumber,
                
                ImageUrls = car.ImageUrls ?? new List<string>()
            };

            
            return Ok(carDetails);
        }

        //POST: api/cars
        [HttpPost]
        public async Task<ActionResult<CarDetailsDto>> CreateCar([FromBody] CarCreateDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (createDto.UserId == 0)
            {
                return BadRequest("User is missing.");
            }

            if (!await _context.Users.AnyAsync(u => u.Id == createDto.UserId))
            {
                return BadRequest("User does not exist.");
            }
           

            var car = new Car
            {
                Make = createDto.Make,
                Model = createDto.Model,
                Year = createDto.Year,
                Price = createDto.Price,
                Mileage = createDto.Mileage,
                FuelType = createDto.FuelType,
                Transmission = createDto.Transmission,
                Color = createDto.Color,
                Description = createDto.Description,
                UserId = createDto.UserId,
                CreatedAt = DateTime.Now,
                UpdatedAt = null,
                ImageUrls = createDto.ImageUrls
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            var createdCar = await _context.Cars
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == car.Id);

            if (createdCar == null)
            {
                return BadRequest("Car could not be created.");
            }

            var result = new CarDetailsDto
            {
                Id = createdCar.Id,
                Make = createdCar.Make,
                Model = createdCar.Model,
                Year = createdCar.Year,
                Price = createdCar.Price,
                Mileage = createdCar.Mileage,
                FuelType = createdCar.FuelType,
                Transmission = createdCar.Transmission,
                Color = createdCar.Color,
                Description = createdCar.Description,
                CreatedAt = createdCar.CreatedAt,
                UpdatedAt = createdCar.UpdatedAt,

                SellerId = createdCar.UserId,
                SellerFirstName = createdCar.User.FirstName,
                SellerLastName = createdCar.User.LastName,
                SellerPhoneNumber = createdCar.User.PhoneNumber,

                ImageUrls = createdCar.ImageUrls ?? new List<string>()
            };

            return CreatedAtAction(nameof(GetCar), new { id = result.Id }, result);

        }

        //PUT: api/cars/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CarDetailsDto>> UpdateCar(int id, [FromBody] CarUpdateDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            

            var car = await _context.Cars
                .FirstOrDefaultAsync(c => c.Id == id);

            
            if (car == null)
            {
                return NotFound();
            }

            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            car.Make = updateDto.Make;
            car.Model = updateDto.Model;
            car.Year = updateDto.Year;
            car.Price = updateDto.Price;
            car.Mileage = updateDto.Mileage;
            car.FuelType = updateDto.FuelType;
            car.Transmission = updateDto.Transmission;
            car.Color = updateDto.Color;
            car.Description = updateDto.Description;
            car.UpdatedAt = DateTime.Now;

            car.ImageUrls = updateDto.ImageUrls;

            await _context.SaveChangesAsync();

            var createdCar = await _context.Cars
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == car.Id);



            if(createdCar == null)
            {
                return BadRequest("Car could not be updated.");
            }
            
            var result = new CarDetailsDto
            {
                Id = createdCar.Id,
                Make = createdCar.Make,
                Model = createdCar.Model,
                Year = createdCar.Year,
                Price = createdCar.Price,
                Mileage = createdCar.Mileage,
                FuelType = createdCar.FuelType,
                Transmission = createdCar.Transmission,
                Color = createdCar.Color,
                Description = createdCar.Description,
                CreatedAt = createdCar.CreatedAt,
                UpdatedAt = createdCar.UpdatedAt,

                SellerId = createdCar.UserId,
                SellerFirstName = createdCar.User.FirstName,
                SellerLastName = createdCar.User.LastName,
                SellerPhoneNumber = createdCar.User.PhoneNumber,

                ImageUrls = createdCar.ImageUrls ?? new List<string>()
            };
        
            if(car.UserId != userId){
                return BadRequest("You are not the owner of this car.");
            }else{
                _context.Cars.Update(car);
                await _context.SaveChangesAsync();
            }
            return Ok(result);
            
        }

        //DELETE: api/cars/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars
                .FirstOrDefaultAsync(c => c.Id == id);

                if(car == null)
            {
                return NotFound();
            }
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if(car.UserId != userId){
                return BadRequest("You are not the owner of this car.");
            }
            
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //POST: api/cars/upload-image
        [HttpPost("upload-image")]
        [Authorize]
        public async Task<ActionResult> UploadImage(IFormFile file)
        {
            if(file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            // Валидация на файл тип
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Only images are allowed.");
            }

            // Валидация на размер (например максимум 5MB)
            const long maxFileSize = 5 * 1024 * 1024; // 5MB
            if (file.Length > maxFileSize)
            {
                return BadRequest("File size exceeds the maximum allowed size of 5MB.");
            }

            string folderPath = Path.Combine("images", "cars");
            string serverPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderPath);
            
            if (!Directory.Exists(serverPath))
            {
                Directory.CreateDirectory(serverPath);
            }

            string fileName = Guid.NewGuid().ToString() + fileExtension;
            string fullPath = Path.Combine(serverPath, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            string imageUrl = $"/{folderPath.Replace("\\", "/")}/{fileName}";

            return Ok(new { url = imageUrl });
        }
    }
}