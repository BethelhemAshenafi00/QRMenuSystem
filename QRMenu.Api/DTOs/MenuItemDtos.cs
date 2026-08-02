namespace QRMenu.Api.DTOs.MenuItem;

public record CreateMenuItemRequest(
    string Name,
    string Description,
    decimal Price,
   IFormFile? Image,
    bool IsAvailable,
    int CategoryId);

public record UpdateMenuItemRequest(
    string Name,
    string Description,
    decimal Price,
    IFormFile? Image,
    bool IsAvailable,
    int CategoryId);

public record MenuItemResponse(
    int Id,
    string Name,
    string Description,
    decimal Price,
    string Image,
    bool IsAvailable,
    int CategoryId,
    string CategoryName);