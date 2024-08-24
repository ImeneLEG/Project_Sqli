using Microsoft.EntityFrameworkCore;
using Projet_Sqli.Data;
using Projet_Sqli.Services;
using Microsoft.AspNetCore.Authentication.Cookies; // authentication cookies

var builder = WebApplication.CreateBuilder(args);

// Configure HTTPS redirection
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
builder.Services.AddScoped<HistoriqueService>();
builder.Services.AddScoped<FavorisService>();

// Register the background service
builder.Services.AddSingleton<VideoRetrievalService>();
builder.Services.AddHostedService<VideoRetrievalService>(provider => provider.GetRequiredService<VideoRetrievalService>());

// Add controllers and JSON configuration
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Cookie Authentication
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/auth/login"; // Path to redirect unauthorized users
        options.LogoutPath = "/api/auth/logout"; // Path for logout
        options.Cookie.HttpOnly = true; // Protect against XSS
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Use secure cookies (HTTPS)
        options.Cookie.SameSite = SameSiteMode.Strict; // Protect against CSRF
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // Your frontend URL
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add logging
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole(); // Log to the console
    logging.AddDebug(); // Log to debug output
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin"); // Apply CORS policy

app.UseAuthorization();

app.MapControllers();

app.Run();
