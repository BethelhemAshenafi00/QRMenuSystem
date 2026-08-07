using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using QRMenu.Api.Authentication;
using QRMenu.Api.Data;
using QRMenu.Api.Services;
using QRMenu.Api.Services.Interfaces;
using QRMenu.Api.Helpers;
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);


var builder = WebApplication.CreateBuilder(args);

// =====================================================
// Controllers + JSON
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
    // Connection string is read from either:
    //   1. an environment variable "DefaultConnection"
    //   2. the "ConnectionStrings:DefaultConnection" config value
    //
    // On Render, set the env var "DefaultConnection" (or
    // "ConnectionStrings__DefaultConnection") in the dashboard
    // so the API can reach your hosted Postgres instead of localhost.
    var connectionString =
        Environment.GetEnvironmentVariable("DefaultConnection")
        ?? builder.Configuration.GetConnectionString("DefaultConnection");

    options.UseNpgsql(connectionString);
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
        .Get<JwtSettings>()
        ?? throw new InvalidOperationException(
            "JWT settings are missing from configuration."
        );

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
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddScoped<IImageService, ImageService>();

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
        options.TokenValidationParameters = new TokenValidationParameters
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


// 1. Bind the Cloudinary environment variables from Render to your helper model
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

// 2. Register the ImageService so your MenuItemController can use it
builder.Services.AddScoped<IImageService, ImageService>();
// =====================================================
// CORS
// =====================================================
const string CorsPolicyName = "AllowClient";

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "https://qrmenu-client-osgf.onrender.com",
                "https://qrmenu-admin-c8qm.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// =====================================================
// Build
// =====================================================
var app = builder.Build();

// =====================================================
// Apply Database Migrations (best-effort)
// =====================================================
// On Render, the app cold-starts with a fresh deployment.
// Running migrations automatically ensures the hosted
// Postgres schema is up to date. If the DB is unreachable
// this throws at startup, which makes the real DB error
// visible in Render logs instead of a confusing CORS / 500.
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        dbContext.Database.Migrate();
    }
}
catch (Exception ex)
{
    // Log but continue so the app still starts and the
    // /health endpoint can report status. The DB error
    // will still surface when endpoints are called.
    app.Logger.LogError(
        ex,
        "An error occurred while applying database migrations."
    );
}

// =====================================================
// Middleware Pipeline
// =====================================================

// IMPORTANT: CORS comes FIRST so that its headers are
// added to EVERY response -- including any error/exception
// responses thrown later in the pipeline. This prevents
// browser errors that misreport server faults as CORS issues.
app.UseCors(CorsPolicyName);

// =====================================================
// CORS Fallback for Error Responses
// =====================================================
// Exceptions thrown inside controllers are handled by the
// exception handler below, which runs BEFORE the CORS
// middleware can add its headers to the error body. As a
// result, browsers report 500s as CORS errors. This
// fallback re-adds the allowed origin header to every
// response, including exceptions, so the real error is
// visible in the browser instead of a false CORS message.
app.Use(async (context, next) =>
{
    var origin = context.Request.Headers.Origin.ToString();

    // Only add the header when an Origin is present
    // (i.e. a real cross-origin request).
    if (!string.IsNullOrWhiteSpace(origin))
    {
        context.Response.OnStarting(() =>
        {
            if (!context.Response.Headers.ContainsKey(
                    "Access-Control-Allow-Origin"))
            {
                context.Response.Headers["Access-Control-Allow-Origin"] =
                    origin;
                context.Response.Headers["Access-Control-Allow-Methods"] =
                    "GET, POST, PUT, DELETE, OPTIONS";
                context.Response.Headers["Access-Control-Allow-Headers"] =
                    "Content-Type, Authorization";
            }

            return Task.CompletedTask;
        });
    }

    await next();
});

// =====================================================
// Global Exception Handling
// IMPORTANT:
// This makes API errors visible in Render logs instead
// of appearing only as a mysterious CORS error.
// =====================================================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    // Handle exceptions inline so a clean JSON error is returned,
    // rather than redirecting to an unmapped "/error" route.
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            var exceptionHandlerPathFeature =
                context.Features.Get<
                    Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature
                >();

            context.Response.StatusCode = 500;

            context.Response.ContentType =
                "application/json";

            await context.Response.WriteAsJsonAsync(new
            {
                status = 500,
                error = "Internal Server Error",
                detail = exceptionHandlerPathFeature?.Error?.Message
            });
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

app.UseAuthentication();

app.UseAuthorization();

app.UseStaticFiles();

// =====================================================
// Controllers
// =====================================================
app.MapControllers();

// =====================================================
// Health Check
// =====================================================
app.MapGet("/health", () =>
{
    return Results.Ok(new
    {
        status = "healthy",
        service = "QRMenu API",
        time = DateTime.UtcNow
    });
});

app.Run();