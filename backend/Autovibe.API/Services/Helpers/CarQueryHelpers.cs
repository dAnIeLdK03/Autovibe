
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
            query = query.Where(c => MileagePredicate(c, filters.Mileage ?? ""));
        }
        if(filters.Power.HasValue && filters.Power > 0)
        {
            query = query.Where(c => c.Power == filters.Power);
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

    private static bool MileagePredicate(Car c, string mileage)
    {
        return mileage switch
        {
          "to10000" => c.Mileage <= 10000,
          "to20000" => c.Mileage <= 20000,
          "to50000" => c.Mileage <= 50000,
          "to100000" => c.Mileage <= 100000,
          "to150000" => c.Mileage <= 150000,
          "to200000" => c.Mileage <= 200000,
          "to250000" => c.Mileage <= 250000,
          "to300000" => c.Mileage <= 300000,
          "over300000" => c.Mileage >= 300000,
          _ => true
        };
    }
}