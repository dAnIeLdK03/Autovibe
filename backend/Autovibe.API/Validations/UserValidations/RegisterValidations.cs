using FluentValidation;
using Autovibe.API.DTOs.Users;


namespace Autovibe.API.Validations
{
    public class RegisterValidations : AbstractValidator<UserRegisterDto>
    {
        public RegisterValidations()
        {
             RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email address");

            RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long");

            RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm password is required")
            .Matches(x => x.Password).WithMessage("Passwords do not match");
        
            RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required");

            RuleFor(x => x.LastName) 
            .NotEmpty().WithMessage("Last name is required");

            RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\d+$").WithMessage("Phone number must contain only digits")
            .Length(10).WithMessage("Phone number must be 10 digits long");

        
        }
    }
}