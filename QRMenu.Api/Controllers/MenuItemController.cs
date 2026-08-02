using Microsoft.AspNetCore.Mvc;
using QRMenu.Api.DTOs.MenuItem;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuItemController : ControllerBase
{
    private readonly IMenuItemService _menuItemService;
    private readonly IWebHostEnvironment _environment;

    public MenuItemController(
        IMenuItemService menuItemService,
        IWebHostEnvironment environment)
    {
        _menuItemService = menuItemService;
        _environment = environment;
    }

    // GET: api/MenuItem
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _menuItemService.GetAllAsync();

        return Ok(items.Select(ToResponse));
    }

    // GET: api/MenuItem/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var item = await _menuItemService.GetByIdAsync(id);

        if (item is null)
            return NotFound();

        return Ok(ToResponse(item));
    }

    // POST: api/MenuItem
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create(
        [FromForm] CreateMenuItemRequest request)
    {
        string imageUrl = string.Empty;

        if (request.Image is not null)
        {
            imageUrl = await SaveImageAsync(request.Image);
        }

        var menuItem = new MenuItem
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = imageUrl,
            IsAvailable = request.IsAvailable,
            CategoryId = request.CategoryId
        };

        var created = await _menuItemService.CreateAsync(menuItem);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            ToResponse(created)
        );
    }

    // PUT: api/MenuItem/1
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(
        int id,
        [FromForm] UpdateMenuItemRequest request)
    {
        var existingItem = await _menuItemService.GetByIdAsync(id);

        if (existingItem is null)
            return NotFound();

        var imageUrl = existingItem.ImageUrl;

        // If a new image was uploaded, save it
        if (request.Image is not null)
        {
            imageUrl = await SaveImageAsync(request.Image);

            // Delete old image
            DeleteImage(existingItem.ImageUrl);
        }

        var menuItem = new MenuItem
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            ImageUrl = imageUrl,
            IsAvailable = request.IsAvailable,
            CategoryId = request.CategoryId
        };

        var updated = await _menuItemService.UpdateAsync(id, menuItem);

        if (updated is null)
            return NotFound();

        return Ok(ToResponse(updated));
    }

    // DELETE: api/MenuItem/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existingItem = await _menuItemService.GetByIdAsync(id);

        if (existingItem is null)
            return NotFound();

        var deleted = await _menuItemService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        // Delete image from wwwroot
        DeleteImage(existingItem.ImageUrl);

        return NoContent();
    }

    // Save uploaded image
    private async Task<string> SaveImageAsync(IFormFile image)
    {
        var uploadsFolder = Path.Combine(
            _environment.WebRootPath,
            "uploads",
            "menu"
        );

        Directory.CreateDirectory(uploadsFolder);

        var extension = Path.GetExtension(image.FileName);

        var fileName = $"{Guid.NewGuid()}{extension}";

        var filePath = Path.Combine(
            uploadsFolder,
            fileName
        );

        await using var stream = new FileStream(
            filePath,
            FileMode.Create
        );

        await image.CopyToAsync(stream);

        return $"/uploads/menu/{fileName}";
    }

    // Delete uploaded image
    private void DeleteImage(string? imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            return;

        var fileName = Path.GetFileName(imageUrl);

        var filePath = Path.Combine(
            _environment.WebRootPath,
            "uploads",
            "menu",
            fileName
        );

        if (System.IO.File.Exists(filePath))
        {
            System.IO.File.Delete(filePath);
        }
    }

    // Convert Entity → Response DTO
    private static MenuItemResponse ToResponse(MenuItem m) => new(
        m.Id,
        m.Name,
        m.Description,
        m.Price,
        m.ImageUrl,
        m.IsAvailable,
        m.CategoryId,
        m.Category?.Name ?? string.Empty
    );
}