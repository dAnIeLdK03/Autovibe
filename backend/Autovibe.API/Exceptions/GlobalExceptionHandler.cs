using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Diagnostics;
using Autovibe.API.Exceptions;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IWebHostEnvironment _env;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        _env = env;
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
        ForbiddenException => (StatusCodes.Status403Forbidden, exception.Message),

        _ => (StatusCodes.Status500InternalServerError, "Unexpected error occurred.")
    };
    
    
        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = message
        };

        // Specially for development, send more info
        if(_env.IsDevelopment())
        {
            response.Details = exception.StackTrace;
        }

        httpContext.Response.StatusCode = response.StatusCode;

        await httpContext.Response.WriteAsJsonAsync(
            new { statusCode = response.StatusCode, message = response.Message, details = response.Details },
            cancellationToken);

        return true;

    }
}