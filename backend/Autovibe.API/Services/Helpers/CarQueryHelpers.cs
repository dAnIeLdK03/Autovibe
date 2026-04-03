
using Autovibe.API.DTOs.Cars;
using Autovibe.API.Models;

namespace Autovibe.API.Services.Helpers;

public static class CarQueryHelpers
{
    public static IQueryable<Car> ApplyFilters(this IQueryable<Car> query, CarFiltersDto filters)
    {
        if (filters.MinYear.HasValue)
        {
            query = query.Where(c => c.Year >= filters.MinYear.Value);
        }
        if (filters.MaxYear.HasValue)
        {
            query = query.Where(c => c.Year <= filters.MaxYear.Value);
        }
        if(!string.IsNullOrEmpty(filters.FuelType) && filters.FuelType != "Fuel")
        {
            query = query.Where(c => c.FuelType == filters.FuelType);
        }
        if(!string.IsNullOrEmpty(filters.Transmission) && filters.Transmission != "Transmission")
        {
            query = query.Where(c => c.Transmission == filters.Transmission);
        }
        if (!string.IsNullOrEmpty(filters.Mileage) && filters.Mileage != "Mileage")
        {
            query = filters.Mileage switch
            {
                "to 10000" => query.Where(c => c.Mileage <= 10000),
                "to 20000" => query.Where(c => c.Mileage <= 20000),
                "to 50000" => query.Where(c => c.Mileage <= 50000),
                "to 100000" => query.Where(c => c.Mileage <= 100000),
                "to 150000" => query.Where(c => c.Mileage <= 150000),
                "to 200000" => query.Where(c => c.Mileage <= 200000),
                "to 250000" => query.Where(c => c.Mileage <= 250000),
                "to 300000" => query.Where(c => c.Mileage <= 300000),
                "over 300000" => query.Where(c => c.Mileage >= 300000),
                _ => query
            };
        }
        if(filters.Power.HasValue && filters.Power > 0)
        {
            query = query.Where(c => c.Power == filters.Power);
        }
        if(!string.IsNullOrEmpty(filters.BodyType) && filters.BodyType != "BodyType")
        {
            query = query.Where(c => c.BodyType == filters.BodyType);
        }

        return query;
    }

    public static IQueryable<Car> ApplySorting(this IQueryable<Car> query, string? sortType)
    {
        return sortType switch
        {
            "Newest" => query.OrderByDescending(c => c.Id),
            "PriceAsc" => query.OrderBy(c => c.Price),
            "PriceDesc" => query.OrderByDescending(c => c.Price),
            "YearDesc" => query.OrderByDescending(c => c.Year),
            _  => query.OrderByDescending(c => c.Id)
        };
    }
}