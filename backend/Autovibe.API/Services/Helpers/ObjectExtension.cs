using System.Diagnostics.CodeAnalysis;
using Autovibe.API.Exceptions;

public static class ObjectExtension
{
    public static T ThrowIfNull<T>([NotNull]this T obj, string message)
    {
        if(obj == null)
        {
            throw new NotFoundException(message);
        }

        return obj;
    }

    public static T ThrowIfForbidden<T>(this T obj, bool isForbidden, string message) where T : class
    {
        if (isForbidden)
        {
            throw new ForbiddenException(message);
        }
            return obj;

    }

    public static IFormFile ThrowIfTooLarge(this IFormFile file, long maxFileSize, string message)
    {
        if(file.Length > maxFileSize)
        {
            throw new BadRequestException(message);
        }
        return file;
    }

    public static int ThrowIfLessThan(this int value, int min, string message)
    {
        if(value < min)
        {
            throw new BadRequestException(message);
        }
        return value;
    }

    public static int THrowIfLessThanAndMoreThan(this int value, int min, int max, string message)
    {
        if(value < min || value > max)
        {
            throw new BadRequestException(message);
        }
        return value;
    }

    public static void ThrowIfTrue(this bool condition, string message)
    {
        if (condition)
        {
            throw new ConflictException(message);
        }
    }

    
    public static void ThrowIfDoesNotMatchAndIsNull(this int? currentUserId, int index, string message)
    {
        if (currentUserId == null || currentUserId != index)
        {
            throw new UnauthorizedException(message);
        }

    }

}