using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Autovibe.API.Migrations
{
    /// <inheritdoc />
    public partial class FixCarCreatedAtNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("SET SESSION sql_mode = ''");
            migrationBuilder.Sql(
                "UPDATE `Cars` SET `CreatedAt` = UTC_TIMESTAMP() WHERE `CreatedAt` IS NULL OR CAST(`CreatedAt` AS CHAR) = '0000-00-00 00:00:00'");
            migrationBuilder.Sql("SET SESSION sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Cars",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(6)",
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Cars",
                type: "datetime(6)",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime(6)");
        }
    }
}
