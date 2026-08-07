using Microsoft.AspNetCore.Mvc;
using QRMenu.Api.DTOs.MenuItem;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;
using QRMenu.Api.Services; // Ensure your Cloudinary IImageService namespace is added here

namespace QRMenu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuItemController : ControllerBase
{
    private readonly IMenuItemService _menuItemService;
    private readonly IImageService _imageService; // Swapped out IWebHostEnvironment for your cloud asset service

    public MenuItemController(
        IMenuItemService menuItemService,
        IImageService imageService)
    {
        _menuItemService = menuItemService;
        _imageService = imageService;
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
            // Uploads image straight to Cloudinary bucket under the "menu" directory folder
            imageUrl = await _imageService.UploadImageAsync(request.Image, "menu");
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

        if (request.Image is not null)
        {
            // Uploads replacement image over to Cloudinary bucket
            imageUrl = await _imageService.UploadImageAsync(request.Image, "menu");
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

        return NoContent();
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
