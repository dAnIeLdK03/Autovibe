using Autovibe.API.DTOs.Cars;
using Autovibe.API.Extensions;
using Autovibe.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autovibe.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpPost("{carId:int}")]
        public async Task<IActionResult> Add(int carId)
        {
            var userId = User.GetUserId();
            userId.ThrowIfNull("Log in first");

            await _favoriteService.AddAsync(userId.Value, carId);

            return Created();
        }

        [HttpDelete("{carId:int}")]
        public async Task<IActionResult> Remove(int carId)
        {
            var userId = User.GetUserId();
            userId.ThrowIfNull("Log in first");

            await _favoriteService.RemoveAsync(userId.Value, carId);

            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<PageResponse<CarListDto>>> Get(int pageNumber = 1, int pageSize = 18)
        {
            var userId = User.GetUserId();
            userId.ThrowIfNull("Log in first");

            pageNumber.ThrowIfNull("Page can't be 0");
            pageSize.ThrowIfLessThanAndMoreThan(1, 18, "Page size can't be less than 0 and greater than 18");

            var result = await _favoriteService.GetPageAsync(userId.Value, pageNumber, pageSize);
            return Ok(result);
        }




    }


}