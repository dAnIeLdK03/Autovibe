using Autovibe.API.DTOs.Cars;
using Autovibe.API.Models;
using Mapster;

namespace Autovibe.API.Services.Helpers
{
    public static class MapsterConfig
    {
        public static void Register()
        {
            TypeAdapterConfig<Car, CarDetailsDto>.NewConfig()
                .Map(dest => dest.SellerId, src => src.UserId)
                .Map(dest => dest.SellerFirstName, src => src.User.FirstName)
                .Map(dest => dest.SellerLastName, src => src.User.LastName)
                .Map(dest => dest.SellerPhoneNumber, src => src.User.PhoneNumber);
        
            TypeAdapterConfig<Car, CarListDto>.NewConfig()
                .Map(dest => dest.ShortDescription, src =>
                    src.Description != null && src.Description.Length > 100
                        ? src.Description.Substring(0, 100) + "..."
                        : src.Description)
                .Map(dest => dest.ImageUrls, src => src.ImageUrls ?? new List<string>());
        }
    }
}