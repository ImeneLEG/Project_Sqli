using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projet_Sqli.Migrations
{
    /// <inheritdoc />
    public partial class AddJsonFieldsToVideos : Migration
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

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 13, 10, 9, 42, 842, DateTimeKind.Local).AddTicks(8931), new DateTime(2024, 8, 13, 10, 9, 42, 842, DateTimeKind.Local).AddTicks(8990) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 13, 10, 9, 42, 842, DateTimeKind.Local).AddTicks(8994), new DateTime(2024, 8, 13, 10, 9, 42, 842, DateTimeKind.Local).AddTicks(8996) });
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

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 12, 12, 55, 4, 154, DateTimeKind.Local).AddTicks(62), new DateTime(2024, 8, 12, 12, 55, 4, 154, DateTimeKind.Local).AddTicks(143) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 12, 12, 55, 4, 154, DateTimeKind.Local).AddTicks(265), new DateTime(2024, 8, 12, 12, 55, 4, 154, DateTimeKind.Local).AddTicks(269) });
        }
    }
}
