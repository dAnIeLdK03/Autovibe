using FluentValidation;
using Autovibe.API.DTOs.Users;

namespace Autovibe.API.Validations
{
    public class UserUpdateValidations : AbstractValidator<UserUpdateDto>
    {
        public UserUpdateValidations()
        {
            RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name can't be empty")
            .MinimumLength(3).WithMessage("First name must be at least 3 characters")
            .MaximumLength(50).WithMessage("First name can't contain more than 50 characters");

            RuleFor(x => x.LastName)
           .MinimumLength(3).WithMessage("Last name must be at least 3 characters")
           .MaximumLength(50).WithMessage("Last name can't contain more than 50 characters");

            RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[0-9]+$").WithMessage("Invalid format. Use digits and optional '+' in front .")
            .Length(10,14).WithMessage("Phone number must be between 10 and 14 digits long");
        }
    }
}