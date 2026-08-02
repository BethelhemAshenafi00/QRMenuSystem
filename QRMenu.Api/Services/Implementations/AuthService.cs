using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using QRMenu.Api.Authentication;
using QRMenu.Api.Data;
using QRMenu.Api.DTOs.Auth;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtSettings _jwtSettings;

    public AuthService(AppDbContext context, IOptions<JwtSettings> jwtSettings)
    {
        _context     = context;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);
        if (exists)
            return null;

        var user = new User
        {
            FullName     = request.FullName,
            Email        = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role         = "Admin"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new AuthResponse(
            GenerateToken(user),
            user.FullName,
            user.Email,
            user.Role);
    }

    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null)
            return null;

        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!passwordValid)
            return null;

        return new AuthResponse(
            GenerateToken(user),
            user.FullName,
            user.Email,
            user.Role);
    }

    private string GenerateToken(User user)
    {
        var key         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email,           user.Email),
            new Claim(ClaimTypes.Name,            user.FullName),
            new Claim(ClaimTypes.Role,            user.Role)
        };

        var token = new JwtSecurityToken(
            issuer:             _jwtSettings.Issuer,
            audience:           _jwtSettings.Audience,
            claims:             claims,
            expires:            DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}