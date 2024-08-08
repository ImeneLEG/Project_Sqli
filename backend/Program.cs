using Microsoft.EntityFrameworkCore;
using Projet_Sqli.Data;
using Projet_Sqli.Services;

using Microsoft.AspNetCore.Authentication.Cookies; // authentification cookies

var builder = WebApplication.CreateBuilder(args);


// Ajoutez cette ligne pour configurer HTTPS
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 5001; // Ou le port que vous souhaitez utiliser pour HTTPS
});


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


// Ajouter le service d'historique(imene part) 
builder.Services.AddScoped<HistoriqueService>();


//Ajout des controlleurs 
builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();



// Configure Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/auth/login"; // Chemin pour rediriger les utilisateurs non authentifi�s
        options.LogoutPath = "/api/auth/logout"; // Chemin pour la d�connexion
        options.Cookie.HttpOnly = true; // Prot�ger le cookie contre les attaques XSS
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Utiliser des cookies s�curis�s (HTTPS)
        options.Cookie.SameSite = SameSiteMode.Strict; // Prot�ger contre les attaques CSRF
    });


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});



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
