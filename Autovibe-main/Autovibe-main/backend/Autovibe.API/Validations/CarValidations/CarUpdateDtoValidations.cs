using FluentValidation;
using Autovibe.API.DTOs.Cars;


namespace Autovibe.API.Validations
{
    public class CarUpdateDtoValidations : AbstractValidator<CarUpdateDto>
    {
        public CarUpdateDtoValidations()
        {
            RuleFor(x => x.Make)
            .NotEmpty().WithMessage("Make is required.")
            .Length(2, 50).WithMessage("Make must be between 2 and 50 characters.");

            RuleFor(x => x.Model)
            .NotEmpty().WithMessage("Model is required.")
            .Length(2, 50).WithMessage("Model must be between 2 and 50 characters.");

            RuleFor(x => x.Year)
            .NotEmpty().WithMessage("Year is required.")
            .InclusiveBetween(1900, DateTime.Now.Year).WithMessage("Year cannot be in the future.");

            RuleFor(x => x.Price)
            .NotNull().WithMessage("Price is required.")
            .GreaterThan(0).WithMessage("Price cant't be a negative number.");

            RuleFor(x => x.Mileage)
            .NotNull().WithMessage("Mileage is required.")
            .GreaterThanOrEqualTo(0).WithMessage("Mileage can't be a negative number.");

            RuleFor(x => x.FuelType)
            .NotEmpty().WithMessage("Fuel type is required.");

            RuleFor(x => x.Transmission)
            .NotEmpty().WithMessage("Transmission is required.");

            RuleFor(x => x.Color)
            .NotEmpty().WithMessage("Color is required.")
            .Length(2, 50).WithMessage("Color must be between 2 and 50 characters.");

            RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .Length(10, 500).WithMessage("Description must be between 10 and 500 characters.");

        }
    }
}