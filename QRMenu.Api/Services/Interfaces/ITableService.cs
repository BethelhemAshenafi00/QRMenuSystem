using QRMenu.Api.Entities;

namespace QRMenu.Api.Services.Interfaces;

public interface ITableService
{
    Task<IEnumerable<Table>> GetAllAsync();

    Task<Table?> GetByIdAsync(int id);

    Task<Table> CreateAsync(Table table);

    Task<Table?> UpdateAsync(int id, Table table);

    Task<bool> DeleteAsync(int id);
}