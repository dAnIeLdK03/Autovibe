using FluentValidation;
using Autovibe.API.DTOs.Users;

namespace Autovibe.API.Validations
{
    public class AdminUpdateUserRoleDtoValidations : AbstractValidator<AdminUpdateUserRoleDto>
    {
        public AdminUpdateUserRoleDtoValidations()
        {
            RuleFor(x => x.Role)
                .IsInEnum()
                .WithMessage("Invalid role value.");
        }
    }
}
