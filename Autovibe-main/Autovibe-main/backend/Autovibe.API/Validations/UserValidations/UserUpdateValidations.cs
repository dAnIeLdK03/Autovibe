using FluentValidation;
using Autovibe.API.DTOs.Users;

namespace Autovibe.API.Validations
{
    public class UserUpdateValidations : AbstractValidator<UserUpdateDto>
    {
        public UserUpdateValidations()
        {
            RuleFor(x => x.FirstName)
            .MinimumLength(3).WithMessage("First name must be at least 3 characters")
            .MaximumLength(50).WithMessage("First name can't contain more thna 50 characters");
            
             RuleFor(x => x.LastName)
            .MinimumLength(3).WithMessage("First name must be at least 3 characters")
            .MaximumLength(50).WithMessage("First name can't contain more thna 50 characters");
            
            RuleFor(x => x.PhoneNumber)
            .Matches(@"^\+?[0-9]{7,15}$").WithMessage("Invalid format. Use digits (7-15) and optional '+' in front .")
            .Must(phone => !phone.Contains(" ")).WithMessage("The phone number must not contain spaces..")
            .Length(10).WithMessage("Phone number must be 10 digits long");
        }
    }
}