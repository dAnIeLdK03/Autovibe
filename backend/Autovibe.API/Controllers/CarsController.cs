using Autovibe.API.Data;
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly AppDbContext _context;

        //contructor
        public CarsController(AppDbContext context)
        {
            _context = context;
        }

        //GET: api/cars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarListDto>>> GetCars()
        {
            var cars = await _context.Cars
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
                    : c.Description
                })
                .ToListAsync();

            return Ok(cars);
        }

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
                SellerPhoneNumber = car.User.PhoneNumber
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
                UpdatedAt = null
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
                SellerPhoneNumber = createdCar.User.PhoneNumber
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
                SellerPhoneNumber = createdCar.User.PhoneNumber
            };
        
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
            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}