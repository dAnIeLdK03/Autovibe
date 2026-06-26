

using Autovibe.API.Exceptions;
using SixLabors.ImageSharp;

public static class ImageValidator
{
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
    }
}