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
                    Description = c.Description != null && c.Description.Length > 100
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
        
    }

}