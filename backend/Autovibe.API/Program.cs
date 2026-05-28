using Autovibe.API.DTOs.Cars;
using Autovibe.API.Extensions;
using Autovibe.API.Services.BackgroundSevices;
using Autovibe.API.Validations;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAppCore();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuth(builder.Configuration);
builder.Services.AddApiLimits();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CarCreateDtoValidations>();
builder.Services.AddHostedService<CarImageCleanupWorker>();

var app = builder.Build();

app.UseForwardedHeaders();
app.UseSwaggerIfDev();
app.UseAppPipeline();
app.MapHealthEndpoints();


app.MapControllers();
app.Run();

public partial class Program { }