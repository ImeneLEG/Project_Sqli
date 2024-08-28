using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projet_Sqli.Migrations
{
    /// <inheritdoc />
    public partial class Initialmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Views",
                table: "Videos",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "TrendingRanks",
                table: "Videos",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max");

            migrationBuilder.AlterColumn<string>(
                name: "Likes",
                table: "Videos",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Comments",
                table: "Videos",
                type: "json",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 28, 9, 14, 31, 368, DateTimeKind.Local).AddTicks(8234), new DateTime(2024, 8, 28, 9, 14, 31, 368, DateTimeKind.Local).AddTicks(8255) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 28, 9, 14, 31, 368, DateTimeKind.Local).AddTicks(8259), new DateTime(2024, 8, 28, 9, 14, 31, 368, DateTimeKind.Local).AddTicks(8261) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Views",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json");

            migrationBuilder.AlterColumn<string>(
                name: "TrendingRanks",
                table: "Videos",
                type: "nvarchar(max",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json");

            migrationBuilder.AlterColumn<string>(
                name: "Likes",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json");

            migrationBuilder.AlterColumn<string>(
                name: "Comments",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "json");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 27, 16, 53, 25, 403, DateTimeKind.Local).AddTicks(5962), new DateTime(2024, 8, 27, 16, 53, 25, 403, DateTimeKind.Local).AddTicks(5979) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 27, 16, 53, 25, 403, DateTimeKind.Local).AddTicks(5982), new DateTime(2024, 8, 27, 16, 53, 25, 403, DateTimeKind.Local).AddTicks(5983) });
        }
    }
}
