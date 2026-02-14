using FluentValidation;
using Autovibe.API.DTOs.Users;


namespace Autovibe.API.Validations
{
    public class LoginValidations : AbstractValidator<UserLoginDto>
    {
        public LoginValidations()
        {
            RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email address");

            RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long");
        }
    }
}