using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;
using Autovibe.API.Exceptions;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        //Logging the error
        _logger.LogError(exception, "An unhandled exception occurred, {Message}", exception.Message);
        
        var (statusCode, message) = exception switch
    {
        NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
        UnauthorizedException => (StatusCodes.Status401Unauthorized, exception.Message),
        ConflictException => (StatusCodes.Status409Conflict, exception.Message),
        BadRequestException => (StatusCodes.Status400BadRequest, exception.Message),
        InternalException => (StatusCodes.Status500InternalServerError, exception.Message),

        _ => (StatusCodes.Status500InternalServerError, "Unexpected error occurred.")
    };
    
    
        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = message
        };

        // Specially for development, send more info
        if(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
        {
            response.Details = exception.StackTrace;
        }

        httpContext.Response.StatusCode = response.StatusCode;

        await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

        return true;

    }
}