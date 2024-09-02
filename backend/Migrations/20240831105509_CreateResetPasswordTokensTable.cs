using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Projet_Sqli.Migrations
{
    /// <inheritdoc />
    public partial class CreateResetPasswordTokensTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ResetPasswordTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Token = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResetPasswordTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResetPasswordTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 31, 11, 55, 8, 402, DateTimeKind.Local).AddTicks(1169), new DateTime(2024, 8, 31, 11, 55, 8, 402, DateTimeKind.Local).AddTicks(1247) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 31, 11, 55, 8, 402, DateTimeKind.Local).AddTicks(1253), new DateTime(2024, 8, 31, 11, 55, 8, 402, DateTimeKind.Local).AddTicks(1258) });

            migrationBuilder.CreateIndex(
                name: "IX_ResetPasswordTokens_UserId",
                table: "ResetPasswordTokens",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResetPasswordTokens");

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 31, 11, 39, 3, 205, DateTimeKind.Local).AddTicks(1714), new DateTime(2024, 8, 31, 11, 39, 3, 205, DateTimeKind.Local).AddTicks(1772) });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2024, 8, 31, 11, 39, 3, 205, DateTimeKind.Local).AddTicks(1777), new DateTime(2024, 8, 31, 11, 39, 3, 205, DateTimeKind.Local).AddTicks(1779) });
        }
    }
}
