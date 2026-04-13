
using Autovibe.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Autovibe.API.Controllers
{
    [Route("api/controller")]
    [ApiController]
    [Authorize]

    public class FavoriteController : ControllerBase
    {
        
    }

    
}