using Microsoft.EntityFrameworkCore;
using Projet_Sqli.Data;
using Projet_Sqli.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddHttpsRedirection(options =>
{
    options.HttpsPort = 5001; // Set your preferred HTTPS port
});

// Add the configuration for ApplicationDbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register HttpClient for VideoServices
builder.Services.AddHttpClient<VideoServices>();

// Add other services
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<HistoriqueService>(); // Historical service
builder.Services.AddScoped<FavorisService>(); // Favorite service

// Register the background service
builder.Services.AddSingleton<VideoRetrievalService>();
builder.Services.AddHostedService<VideoRetrievalService>(provider => provider.GetRequiredService<VideoRetrievalService>());

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/auth/login"; // Path for redirecting unauthenticated users
        options.LogoutPath = "/api/auth/logout"; // Path for logout
        options.Cookie.HttpOnly = true; // Protect cookie against XSS
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Use secure cookies (HTTPS)
        options.Cookie.SameSite = SameSiteMode.Strict; // Protect against CSRF attacks
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy =>
        {
            policy.AllowAnyOrigin() // Allow all origins
                  .AllowAnyMethod() // Allow all HTTP methods
                  .AllowAnyHeader(); // Allow all headers
        });
});

builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole(); // Log to the console
    logging.AddDebug(); // Log to debug output
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS policy
app.UseCors("AllowAllOrigins");

app.UseHttpsRedirection();

app.UseAuthentication(); // Add this line to enable authentication
app.UseAuthorization();

app.MapControllers();

app.Run();
