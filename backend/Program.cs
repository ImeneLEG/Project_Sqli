using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

// Ajoutez cette ligne pour configurer HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 5001; // Ou le port que vous souhaitez utiliser pour HTTPS
});

// Ajouter la configuration du DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Ajouter le service UserService
builder.Services.AddScoped<UserService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
