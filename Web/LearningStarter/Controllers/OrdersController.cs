using System.Linq;
using System.Security.Claims;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace LearningStarter.Controllers;

[Authorize]
[ApiController]
[Route("api/orders")]
public class OrdersController: ControllerBase
{
    private readonly DataContext _dataContext;
    
    public OrdersController(DataContext dataContext)
    {
        _dataContext = dataContext; 
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        
        var data = _dataContext
            .Set<Orders>()
            .Where(x => x.UserId == userId)
            .Select(orders => new OrdersGetDto
            {
                Id = orders.Id,
                UserId = orders.UserId,
                Status = orders.Status,
                CreatedAt = orders.CreatedAt,
                ShippingAddressId = orders.ShippingAddressId,
                Payments = orders.Payments.Select(payment => new PaymentGetDto {
                    Id = payment.Id,
                    OrderId = payment.OrderId,
                    PaymentMethodId = payment.PaymentMethodId,
                    PaymentStatusId = payment.PaymentStatusId,
                    Amount = payment.Amount,
                    PaidAt = payment.PaidAt
                }).ToList()
            })
            .ToList();

        response.Data = data;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var data = _dataContext
            .Set<Orders>()
            .Where(x => x.UserId == userId)
            .Select(orders => new OrdersGetDto
            {
                Id = orders.Id,
                UserId = orders.UserId,
                Status = orders.Status,
                CreatedAt = orders.CreatedAt,
                ShippingAddressId = orders.ShippingAddressId,
                Payments = orders.Payments.Select(payment => new PaymentGetDto {
                    Id = payment.Id,
                    OrderId = payment.OrderId,
                    PaymentMethodId = payment.PaymentMethodId,
                    PaymentStatusId = payment.PaymentStatusId,
                    Amount = payment.Amount,
                    PaidAt = payment.PaidAt
                }).ToList()
            })
            .FirstOrDefault(orders => orders.Id == id);

        if (data == null)
        {
            response.AddError("id", "Order not found");
            return NotFound(response);
        }

        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] OrdersCreateDto createDto)
    {
        var response = new Response();
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        if (string.IsNullOrEmpty(createDto.Status))
        {
            response.AddError(nameof(createDto.Status), "Status must not be empty");
        }

        if (createDto.ShippingAddressId <= 0)
        {
            response.AddError(nameof(createDto.ShippingAddressId), "A valid Shipping Address is required.");
        }

        var addressExists = _dataContext.Set<ShippingAddresses>().Any(x => x.Id == createDto.ShippingAddressId);
        if (!addressExists)
        {
            response.AddError(nameof(createDto.ShippingAddressId), "ShippingAddress does not exist.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var ordersToCreate = new Orders
        {
            UserId = userId,
            Status = createDto.Status,
            ShippingAddressId = createDto.ShippingAddressId,
        };

        _dataContext.Set<Orders>().Add(ordersToCreate);
        _dataContext.SaveChanges();

        var ordersToReturn = new OrdersGetDto
        {
            Id = ordersToCreate.Id,
            UserId = ordersToCreate.UserId,
            Status = ordersToCreate.Status,
            ShippingAddressId = ordersToCreate.ShippingAddressId,
        };
        response.Data = ordersToReturn;
        
        return Created("", response);
    }
    
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] OrdersUpdateDto updateDto, int id)
    {
        var response = new Response();
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        
        if (string.IsNullOrEmpty(updateDto.Status))
        {
            response.AddError(nameof(updateDto.Status), "Status must not be empty");
        }

        if (updateDto.ShippingAddressId <= 0)
        {
            response.AddError(nameof(updateDto.ShippingAddressId), "A valid Shipping Address is required.");
        }
        
        var ordersToUpdate = _dataContext.Set<Orders>()
            .FirstOrDefault(orders => orders.Id == id && orders.UserId == userId);
        
        if (ordersToUpdate == null)
        {
            response.AddError("id", "Order not found.");
        }
        
        var addressExists = _dataContext.Set<ShippingAddresses>().Any(x => x.Id == updateDto.ShippingAddressId);
        if (!addressExists)
        {
            response.AddError(nameof(updateDto.ShippingAddressId), "ShippingAddress does not exist.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        ordersToUpdate.Status = updateDto.Status;
        ordersToUpdate.ShippingAddressId = updateDto.ShippingAddressId;

        _dataContext.SaveChanges();

        var ordersToReturn = new OrdersGetDto
        {
            Id = ordersToUpdate.Id,
            UserId = ordersToUpdate.UserId,
            Status = ordersToUpdate.Status,
            ShippingAddressId = ordersToUpdate.ShippingAddressId

        };
        response.Data = ordersToReturn;

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

        var ordersToDelete = _dataContext.Set<Orders>()
            .FirstOrDefault(orders => orders.Id == id && orders.UserId == userId);

        if (ordersToDelete == null)
        {
            response.AddError("id", "Order not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        _dataContext.Set<Orders>().Remove(ordersToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}
