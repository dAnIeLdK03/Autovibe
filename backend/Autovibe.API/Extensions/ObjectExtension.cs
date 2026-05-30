using System.Diagnostics.CodeAnalysis;
using System.Numerics;
using Autovibe.API.Exceptions;
using SixLabors.ImageSharp;

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

    public static T ThrowIfInvalidId<T>(this T obj, string message) where T : INumber<T>
    {
        if(obj < T.One)
        {
            throw new BadRequestException(message);
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

    public static int ThrowIfLessThanAndMoreThan(this int value, int min, int max, string message)
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

    public static void ThrowIfFileIsWrongFormat(this IFormFile file, string[] allowExtensions)
    {
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowExtensions.Contains(fileExtension))
        {
            throw new BadRequestException("Wrong file format.");
        }
    }

    public static void ThrowIfImageIsInvalid(this IFormFile file)
    {
        if(file == null || file.Length == 0)
        {
            throw new BadRequestException("The file is empty or do not exists.");
        }
        try
        {
            using var stream = file.OpenReadStream();
            var imageInfo = Image.Identify(stream);
            if(imageInfo == null)
            {
                throw new BadRequestException("The file is not valid image.");
            }
        }
        catch (InvalidImageContentException)
        {
            throw new BadRequestException("The image is corrupted or the format is not supported.");
        }
        catch(Exception)
        {
            throw new BadRequestException("An error occurred while processing the file.");
        }

    }




    public static void EnsureDirectoryExists(this string serverPath)
    {
        if (!Directory.Exists(serverPath))
        {
            Directory.CreateDirectory(serverPath);
        }
    }


}