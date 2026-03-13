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
        var payments = _dataContext.Payments
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

        return Ok(payments);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var payment = _dataContext.Payments
            .Include(p => p.PaymentMethod)
            .Include(p => p.PaymentStatus)
            .Where(p => p.Id == id)
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
            .FirstOrDefault();

        if (payment == null)
        {
            return NotFound();
        }

        return Ok(payment);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreatePaymentRequest request)
    {
        var payment = new Payment
        {
            OrderId = request.OrderId,
            PaymentMethodId = request.PaymentMethodId,
            PaymentStatusId = request.PaymentStatusId,
            Amount = request.Amount,
            PaidAt = DateTimeOffset.UtcNow
        };

        _dataContext.Payments.Add(payment);
        _dataContext.SaveChanges();

        return Ok(payment);
    }
}
