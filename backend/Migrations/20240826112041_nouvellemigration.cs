using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projet_Sqli.Migrations
{
    /// <inheritdoc />
    public partial class nouvellemigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Duration",
                table: "Videos",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 26, 11, 20, 40, 747, DateTimeKind.Local).AddTicks(8490), new DateTime(2024, 8, 26, 11, 20, 40, 747, DateTimeKind.Local).AddTicks(8513) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 26, 11, 20, 40, 747, DateTimeKind.Local).AddTicks(8517), new DateTime(2024, 8, 26, 11, 20, 40, 747, DateTimeKind.Local).AddTicks(8519) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 18, 0, 10, 14, 132, DateTimeKind.Local).AddTicks(6495), new DateTime(2024, 8, 18, 0, 10, 14, 132, DateTimeKind.Local).AddTicks(6554) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 18, 0, 10, 14, 132, DateTimeKind.Local).AddTicks(6556), new DateTime(2024, 8, 18, 0, 10, 14, 132, DateTimeKind.Local).AddTicks(6557) });
        }
    }
}
