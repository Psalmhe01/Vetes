using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly DataContext _dataContext;

    public PaymentController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        response.Data = _dataContext.Set<Payment>()
            .Include(p => p.Order)
            .Include(p => p.PaymentMethod)
            .Include(p => p.PaymentStatus)
            .Select(p => new
            {
                p.Id,
                p.OrderId,
                PaymentMethod = p.PaymentMethod.Type,
                Provider = p.PaymentMethod.Provider,
                Status = p.PaymentStatus.Status,
                p.Amount,
                p.PaidAt
            })
            .ToList();

        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<Orders>()
            .Include(o => o.Payments) // Include payments for the order
            .Select(orders => new OrdersGetDto
            {
                Id = orders.Id,
                UserId = orders.UserId,
                Status = orders.Status,
                CreatedAt = orders.CreatedAt,
                ShippingAddressId = orders.ShippingAddressId,
                Payments = orders.Payments.Select(payment => new PaymentGetDto
                {
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
    public IActionResult Create(CreatePaymentRequest request)
    {
        var response = new Response();
        var paymentToCreate = new Payment
        {
            OrderId = request.OrderId,
            PaymentMethodId = request.PaymentMethodId,
            PaymentStatusId = request.PaymentStatusId,
            Amount = request.Amount,
            PaidAt = DateTimeOffset.UtcNow
        };

        _dataContext.Set<Payment>().Add(paymentToCreate);
        _dataContext.SaveChanges();

        response.Data = paymentToCreate;
        return Ok(paymentToCreate);
    }
}
