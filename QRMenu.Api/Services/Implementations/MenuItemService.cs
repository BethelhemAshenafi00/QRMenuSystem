using Microsoft.EntityFrameworkCore;
using QRMenu.Api.Data;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Services;

public class MenuItemService : IMenuItemService
{
    private readonly AppDbContext _context;

    public MenuItemService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MenuItem>> GetAllAsync()
    {
        return await _context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .ToListAsync();
    }

    public async Task<MenuItem?> GetByIdAsync(int id)
    {
        return await _context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<MenuItem> CreateAsync(MenuItem menuItem)
    {
        _context.MenuItems.Add(menuItem);
        await _context.SaveChangesAsync();
        return menuItem;
    }

    public async Task<MenuItem?> UpdateAsync(int id, MenuItem menuItem)
    {
        var existing = await _context.MenuItems.FindAsync(id);

        if (existing is null)
            return null;

        existing.Name        = menuItem.Name;
        existing.Description = menuItem.Description;
        existing.Price       = menuItem.Price;
        existing.ImageUrl    = menuItem.ImageUrl;
        existing.IsAvailable = menuItem.IsAvailable;
        existing.CategoryId  = menuItem.CategoryId;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.MenuItems.FindAsync(id);

        if (existing is null)
            return false;

        _context.MenuItems.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}