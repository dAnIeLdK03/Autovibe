
using Autovibe.API.Constants;
using Autovibe.API.DTOs.Cars;

namespace Autovibe.API.Services.Helpers
{
    public static class PaginationHelper
    {
        // Validate parameters for pagination. throw exception when are invalid
        public static void Validate(int pageNumber, int pageSize)
        {
            pageNumber.ThrowIfLessThan(1, "Page number cannot be less than 1.");

            pageSize.ThrowIfLessThanAndMoreThan(
                PaginationConstants.MinPageSize,
                PaginationConstants.MaxPageSize,
                $"Page size cannot be less than {PaginationConstants.MinPageSize} or greater than {PaginationConstants.MaxPageSize}.");
        }

        // Packaging the data and the metadata in standart PageResponse
        public static PageResponse<T> BuildResponse<T>(IEnumerable<T> data, int totalItems, int pageNumber, int pageSize)
        {
            return new PageResponse<T>(data, totalItems, pageSize, pageNumber);
        }
    }
}