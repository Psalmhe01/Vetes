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
        var data = _dataContext
            .Set<Payment>()
            .Select(payment => new PaymentGetDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                PaymentMethodId = payment.PaymentMethodId,
                PaymentStatusId = payment.PaymentStatusId,
                Amount = payment.Amount,
                PaidAt = payment.PaidAt,
            }).ToList();
        
        response.Data = data;
        return Ok(response);
        
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var data = _dataContext
            .Set<Payment>()
            .Select(payment => new PaymentGetDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                PaymentMethodId = payment.PaymentMethodId,
                PaymentStatusId = payment.PaymentStatusId,
                Amount = payment.Amount,
                PaidAt = payment.PaidAt,
            }).FirstOrDefault(payment => payment.Id == id);
        
        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] PaymentCreateDto request)
    {
        var response = new Response();

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var payment = new Payment
        {
            OrderId = request.OrderId,
            PaymentMethodId = request.PaymentMethodId,
            PaymentStatusId = request.PaymentStatusId,
            Amount = request.Amount,
            PaidAt = DateTimeOffset.UtcNow
        };
        
        _dataContext.Set<Payment>().Add(payment);
        _dataContext.SaveChanges();

        var paymentToReturn = new PaymentGetDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            PaymentMethodId = payment.PaymentMethodId,
            PaymentStatusId = payment.PaymentStatusId,
            Amount = payment.Amount,
            PaidAt = payment.PaidAt,
        };
        
        response.Data = paymentToReturn;
        return Ok(response);
        
        
    }
}
