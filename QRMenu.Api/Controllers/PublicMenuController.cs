using Microsoft.AspNetCore.Mvc;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Controllers;

[ApiController]
[Route("api/public")]
public class PublicMenuController : ControllerBase
{
    private readonly ICategoryService _categoryService;
    private readonly IMenuItemService _menuItemService;

    public PublicMenuController(
        ICategoryService categoryService,
        IMenuItemService menuItemService)
    {
        _categoryService = categoryService;
        _menuItemService = menuItemService;
    }

    // GET: api/public/categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _categoryService.GetAllAsync();

        return Ok(categories);
    }

    // GET: api/public/menu
    [HttpGet("menu")]
    public async Task<IActionResult> GetMenu()
    {
        var menuItems = await _menuItemService.GetAllAsync();

        // Only show available menu items to customers
        var availableItems = menuItems
            .Where(item => item.IsAvailable);

        return Ok(availableItems);
    }

    // GET: api/public/menu/{id}
    [HttpGet("menu/{id:int}")]
    public async Task<IActionResult> GetMenuItem(int id)
    {
        var menuItem = await _menuItemService.GetByIdAsync(id);

        if (menuItem is null || !menuItem.IsAvailable)
            return NotFound();

        return Ok(menuItem);
    }
}