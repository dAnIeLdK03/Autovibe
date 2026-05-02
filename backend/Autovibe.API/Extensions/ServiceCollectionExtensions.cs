using Autovibe.API.Interfaces;
using Autovibe.API.Models;
using Autovibe.API.Services;
using Autovibe.API.Validations;
using FluentValidation.AspNetCore;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;

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
            options.AddPolicy("AdminOnly", policy =>
                policy.RequireAssertion(context =>
                {
                    var user = context.User;
                    if (user.Identity?.IsAuthenticated != true)
                        return false;
                    foreach (var claim in user.Claims)
                    {
                        var isRoleClaim = claim.Type == System.Security.Claims.ClaimTypes.Role
                            || claim.Type.Equals("role", StringComparison.OrdinalIgnoreCase);
                        if (isRoleClaim && claim.Value.Equals(nameof(Role.Admin), StringComparison.OrdinalIgnoreCase))
                            return true;
                    }

                    return false;
                }));
        });

        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();
        services.AddValidatorsFromAssemblyContaining<CarCreateDtoValidations>();

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

        return services;
    }
}