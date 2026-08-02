namespace QRMenu.Api.DTOs.Category;

public record CreateCategoryRequest(string Name);

public record UpdateCategoryRequest(string Name);

public record CategoryResponse(int Id, string Name, IEnumerable<MenuItemSummary> MenuItems);

public record MenuItemSummary(int Id, string Name, decimal Price, bool IsAvailable);