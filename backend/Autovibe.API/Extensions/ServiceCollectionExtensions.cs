using Autovibe.API.Interfaces;
using Autovibe.API.Services;
using Autovibe.API.Validations;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using FluentValidation;

namespace Autovibe.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppCore(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(opt =>
                opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();
        services.AddValidatorsFromAssemblyContaining<CarCreateDtoValidations>();

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddScoped<ICarService, CarService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IFavoriteService, FavoriteService>();

        return services;
    }
}