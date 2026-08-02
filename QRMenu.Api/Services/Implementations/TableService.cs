using Microsoft.EntityFrameworkCore;
using QRMenu.Api.Data;
using QRMenu.Api.Entities;
using QRMenu.Api.Services.Interfaces;

namespace QRMenu.Api.Services;

public class TableService : ITableService
{
    private readonly AppDbContext _context;

    public TableService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Table>> GetAllAsync()
    {
        return await _context.Tables
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Table?> GetByIdAsync(int id)
    {
        return await _context.Tables
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Table> CreateAsync(Table table)
    {
        _context.Tables.Add(table);
        await _context.SaveChangesAsync();
        return table;
    }

    public async Task<Table?> UpdateAsync(int id, Table table)
    {
        var existing = await _context.Tables.FindAsync(id);

        if (existing is null)
            return null;

        existing.TableNumber = table.TableNumber;
        existing.QrCodeUrl   = table.QrCodeUrl;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.Tables.FindAsync(id);

        if (existing is null)
            return false;

        _context.Tables.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}