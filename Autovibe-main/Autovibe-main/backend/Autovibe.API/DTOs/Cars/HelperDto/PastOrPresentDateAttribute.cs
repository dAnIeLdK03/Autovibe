using System.ComponentModel.DataAnnotations;

public class PastOrPresentDateAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if (value is DateTime dateValue)
        {
            if (dateValue > DateTime.Now)
            {
                return new ValidationResult(ErrorMessage ?? "The date cannot be in the future.");
            }
        }
        return ValidationResult.Success;
    }
}