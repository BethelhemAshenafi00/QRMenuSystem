using Microsoft.AspNetCore.Mvc;
using QRMenu.Api.DTOs.Category;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category is null)
            return NotFound();

        return Ok(ToResponse(category));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        var category = new Category { Name = request.Name };
        var created  = await _categoryService.CreateAsync(category);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToResponse(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryRequest request)
    {
        var category = new Category { Name = request.Name };
        var updated  = await _categoryService.UpdateAsync(id, category);

        if (updated is null)
            return NotFound();

        return Ok(ToResponse(updated));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoryService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }

    private static CategoryResponse ToResponse(Category c) => new(
        c.Id,
        c.Name,
        c.MenuItems.Select(m => new MenuItemSummary(m.Id, m.Name, m.Price, m.IsAvailable))
    );
}