using FluentValidation;
using Autovibe.API.DTOs.Users;

namespace Autovibe.API.Validations
{
    public class ChangePasswordValidations : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordValidations()
        {
            RuleFor(x => x.CurrentPassword)
            .NotEmpty().WithMessage("Current password is required")
            .MinimumLength(6).WithMessage("Current Password must be at least 6 characters");

            RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required")
            .MinimumLength(6).WithMessage("New Password must be at least 6 characters")
            .NotEqual(x => x.CurrentPassword).WithMessage("New password must differ from current password");
        }
    }
}