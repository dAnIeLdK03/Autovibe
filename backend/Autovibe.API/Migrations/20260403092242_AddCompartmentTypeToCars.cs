using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autovibe.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCompartmentTypeToCars : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Compartment",
                table: "Cars",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Compartment",
                table: "Cars");
        }
    }
}
