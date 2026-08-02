using Microsoft.AspNetCore.Mvc;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TableController : ControllerBase
{
    private readonly ITableService _tableService;

    public TableController(ITableService tableService)
    {
        _tableService = tableService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tables = await _tableService.GetAllAsync();
        return Ok(tables);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var table = await _tableService.GetByIdAsync(id);

        if (table is null)
            return NotFound();

        return Ok(table);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Table table)
    {
        var created = await _tableService.CreateAsync(table);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Table table)
    {
        var updated = await _tableService.UpdateAsync(id, table);

        if (updated is null)
            return NotFound();

        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _tableService.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}