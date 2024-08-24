using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projet_Sqli.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIdToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Videos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

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
                values: new object[] { new DateTime(2024, 8, 20, 17, 31, 57, 489, DateTimeKind.Local).AddTicks(653), new DateTime(2024, 8, 20, 17, 31, 57, 489, DateTimeKind.Local).AddTicks(700) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 20, 17, 31, 57, 489, DateTimeKind.Local).AddTicks(704), new DateTime(2024, 8, 20, 17, 31, 57, 489, DateTimeKind.Local).AddTicks(706) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Videos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

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
    }
}
