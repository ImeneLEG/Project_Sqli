using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projet_Sqli.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTypeOfVideoDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                values: new object[] { new DateTime(2024, 8, 19, 12, 31, 47, 532, DateTimeKind.Local).AddTicks(4129), new DateTime(2024, 8, 19, 12, 31, 47, 532, DateTimeKind.Local).AddTicks(4173) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 19, 12, 31, 47, 532, DateTimeKind.Local).AddTicks(4176), new DateTime(2024, 8, 19, 12, 31, 47, 532, DateTimeKind.Local).AddTicks(4178) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                values: new object[] { new DateTime(2024, 8, 13, 17, 50, 21, 80, DateTimeKind.Local).AddTicks(8204), new DateTime(2024, 8, 13, 17, 50, 21, 80, DateTimeKind.Local).AddTicks(8244) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 13, 17, 50, 21, 80, DateTimeKind.Local).AddTicks(8247), new DateTime(2024, 8, 13, 17, 50, 21, 80, DateTimeKind.Local).AddTicks(8248) });
        }
    }
}
