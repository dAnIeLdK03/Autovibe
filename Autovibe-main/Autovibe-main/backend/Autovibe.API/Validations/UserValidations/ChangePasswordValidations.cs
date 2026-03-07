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
            .MinimumLength(6).WithMessage("New Password must be at least 6 characters");

            RuleFor(x => x.ConfirmPassword)
            .NotEmpty().WithMessage("Confirm password is required")
            .MinimumLength(6).WithMessage("Confirm Password must be at least 6 characters")
            .Equal(x => x.NewPassword).WithMessage("New and confirm password do not match");
        }
    }
}