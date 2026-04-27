
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/order-products")] 
public class OrderProductsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public OrderProductsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        response.Data = _dataContext.Set<OrderProduct>()
            .Select(op => new OrderProductGetDto
            {
                Id = op.Id,
                OrderId = op.OrderId,
                ProductSizeId = op.ProductSizeId,
                Quantity = op.Quantity,
                Price = op.Price
            }).ToList();

        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] OrderProductCreateDto createDto)
    {
        var response = new Response();
        
        var orderExists = _dataContext.Set<Orders>().Any(x => x.Id == createDto.OrderId);
        if (!orderExists)
        {
            response.AddError("OrderId", "Order does not exist.");
            return BadRequest(response);
        }

        var orderProductToCreate = new OrderProduct
        {
            OrderId = createDto.OrderId,
            ProductSizeId = createDto.ProductSizeId,
            Quantity = createDto.Quantity,
            Price = 25.00m 
        };

        _dataContext.Set<OrderProduct>().Add(orderProductToCreate);
        _dataContext.SaveChanges();

        response.Data = true;
        return Created("", response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var item = _dataContext.Set<OrderProduct>().Find(id);

        if (item == null)
        {
            response.AddError("id", "Item not found");
            return NotFound(response);
        }

        _dataContext.Set<OrderProduct>().Remove(item);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}