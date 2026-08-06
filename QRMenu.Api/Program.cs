using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using QRMenu.Api.Authentication;
using QRMenu.Api.Data;
using QRMenu.Api.Services;
using QRMenu.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// Controllers
// =====================================================
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;
    });

// =====================================================
// Swagger
// =====================================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =====================================================
// Database
// =====================================================
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// =====================================================
// JWT Settings
// =====================================================
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt")
);

var jwtSettings =
    builder.Configuration
        .GetSection("Jwt")
        .Get<JwtSettings>();

if (jwtSettings == null)
{
    throw new InvalidOperationException(
        "JWT settings are missing from configuration."
    );
}

if (string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException(
        "JWT Key is missing from configuration."
    );
}

var key = Encoding.UTF8.GetBytes(jwtSettings.Key);

// =====================================================
// Application Services
// =====================================================
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IMenuItemService, MenuItemService>();
builder.Services.AddScoped<ITableService, TableService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// =====================================================
// Authentication
// =====================================================
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(key),

                ClockSkew = TimeSpan.FromMinutes(1)
            };
    });

// =====================================================
// Authorization
// =====================================================
builder.Services.AddAuthorization();

// =====================================================
// CORS
// =====================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "https://qrmenu-client-osgf.onrender.com",
                "https://qrmenu-admin-c8qm.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =====================================================
// Build
// =====================================================
var app = builder.Build();

// =====================================================
// Global Exception Handler
// IMPORTANT: This helps us see the REAL 500 error.
// =====================================================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var exceptionHandler =
                context.Features
                    .Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();

            var exception = exceptionHandler?.Error;

            var response = new
            {
                status = 500,
                message = "Internal Server Error",
                error = exception?.Message,
                path = context.Request.Path.ToString()
            };

            await context.Response.WriteAsJsonAsync(response);
        });
    });
}

// =====================================================
// Swagger
// =====================================================
app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "QRMenu API v1"
    );
});

// =====================================================
// Middleware
// =====================================================

// IMPORTANT:
// On Render, HTTPS is normally handled by Render's proxy.
// We don't need to force HTTP -> HTTPS here.
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// CORS MUST be before authentication/authorization
app.UseCors("AllowClient");

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

// =====================================================
// Controllers
// =====================================================
app.MapControllers();

// =====================================================
// Run
// =====================================================
app.Run();
