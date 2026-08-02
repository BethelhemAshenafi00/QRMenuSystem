using QRMenu.Api.Entities;

namespace QRMenu.Api.Services.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<Order>> GetAllAsync();

    Task<Order?> GetByIdAsync(int id);

    Task<Order> CreateAsync(Order order);

    Task<Order?> UpdateAsync(int id, Order order);

    Task<bool> DeleteAsync(int id);
    Task<List<MenuItem>> GetMenuItemsByIdsAsync(List<int> ids);
}