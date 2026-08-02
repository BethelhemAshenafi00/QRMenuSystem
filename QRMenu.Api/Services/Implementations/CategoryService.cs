using Microsoft.EntityFrameworkCore;
using QRMenu.Api.Data;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .Include(c => c.MenuItems)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await _context.Categories
            .AsNoTracking()
            .Include(c => c.MenuItems)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Category> CreateAsync(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category?> UpdateAsync(int id, Category category)
    {
        var existing = await _context.Categories.FindAsync(id);

        if (existing is null)
            return null;

        existing.Name = category.Name;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Categories.FindAsync(id);

        if (existing is null)
            return false;

        _context.Categories.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}