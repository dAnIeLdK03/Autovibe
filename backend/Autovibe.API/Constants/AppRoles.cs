
using Autovibe.API.Models;

namespace Autovibe.API.Constants
{
    
    public static class AppRoles
    {   
        // Using nameof to transform Enum to String
        public const string Admin = nameof(Role.Admin);
        public const string User = nameof(Role.User);
    }
}