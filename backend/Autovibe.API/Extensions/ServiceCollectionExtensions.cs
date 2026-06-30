using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Autovibe.API.Services;
using Autovibe.API.Validations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;
using FluentValidation;
using Autovibe.API.Services.Helpers;

namespace Autovibe.API.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppCore(this IServiceCollection services)
    {
        services.AddHttpContextAccessor();
        MapsterConfig.Register();
        services.AddHttpContextAccessor();

        services.AddControllers()
            .AddJsonOptions(opt =>
                opt.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            const string schemeId = "Bearer";
            options.AddSecurityDefinition(schemeId, new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "Въведи само JWT (eyJ...). Без думата Bearer — UI я добавя."
            });
            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference(schemeId, document)] = []
            });
        });

        services.AddScoped<ICarService, CarService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IFavoriteService, FavoriteService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IImageService, ImageService>();

        return services;
    }
}