using QRMenu.Api.Entities;

namespace QRMenu.Api.Services.Interfaces;

public interface IMenuItemService
{
    Task<IEnumerable<MenuItem>> GetAllAsync();

    Task<MenuItem?> GetByIdAsync(int id);

    Task<MenuItem> CreateAsync(MenuItem menuItem);

    Task<MenuItem?> UpdateAsync(int id, MenuItem menuItem);

    Task<bool> DeleteAsync(int id);
}