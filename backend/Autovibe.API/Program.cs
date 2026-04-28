using Autovibe.API.Data;
using Autovibe.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAppCore();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuth(builder.Configuration);

var app = builder.Build();

app.UseSwaggerIfDev();
app.UseAppPipeline();
app.MapHealthEndpoints();

app.MapControllers();
app.Run();

public partial class Program { }