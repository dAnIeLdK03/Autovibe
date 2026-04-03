using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autovibe.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBodyType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Compartment",
                table: "Cars",
                newName: "BodyType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BodyType",
                table: "Cars",
                newName: "Compartment");
        }
    }
}
