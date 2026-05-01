using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Autovibe.API.Services;
using Autovibe.API.Validations;
using FluentValidation.AspNetCore;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace Autovibe.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppCore(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(opt =>
                opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole(nameof(Role.Admin)));
        });

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