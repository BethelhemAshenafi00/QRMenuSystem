using Microsoft.EntityFrameworkCore;
using QRMenu.Api.Data;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;

    public OrderService(AppDbContext context)
    {
        _context = context;
    }

    // ==========================================
    // GET ALL ORDERS
    // ==========================================

    public async Task<IEnumerable<Order>> GetAllAsync()
    {
        return await _context.Orders
            .AsNoTracking()
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
                .ThenInclude(i => i.MenuItem)
                    .ThenInclude(m => m.Category)
            .OrderByDescending(o => o.Id)
            .ToListAsync();
    }

    // ==========================================
    // GET ORDER BY ID
    // ==========================================

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .AsNoTracking()
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
                .ThenInclude(i => i.MenuItem)
                    .ThenInclude(m => m.Category)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    // ==========================================
    // GET MENU ITEMS BY IDS
    // ==========================================

    public async Task<List<MenuItem>> GetMenuItemsByIdsAsync(
        List<int> ids)
    {
        return await _context.MenuItems
            .AsNoTracking()
            .Include(m => m.Category)
            .Where(m => ids.Contains(m.Id))
            .ToListAsync();
    }

    // ==========================================
    // CREATE ORDER
    // ==========================================

    public async Task<Order> CreateAsync(Order order)
    {
        _context.Orders.Add(order);

        await _context.SaveChangesAsync();

        return order;
    }

    // ==========================================
    // UPDATE ORDER
    // ==========================================

    public async Task<Order?> UpdateAsync(
        int id,
        Order order)
    {
        var existing = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == id);

        if (existing is null)
            return null;

        existing.OrderType = order.OrderType;
        existing.Status = order.Status;
        existing.TotalAmount = order.TotalAmount;
        existing.TableId = order.TableId;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    // ==========================================
    // DELETE ORDER
    // ==========================================

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == id);

        if (existing is null)
            return false;

        _context.Orders.Remove(existing);

        await _context.SaveChangesAsync();

        return true;
    }
}