using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/payment-methods")]
public class PaymentMethodsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public PaymentMethodsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<PaymentMethod>()
            .Select(paymentmethod => new
            {
                paymentmethod.Id,
                paymentmethod.UserId,
                paymentmethod.Type,
                paymentmethod.Provider,
                paymentmethod.Last4,
                paymentmethod.ExpMonth,
                paymentmethod.ExpYear
            })
            .ToList();

        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create(PaymentMethod paymentMethod)
    {
        var response = new Response();

        _dataContext.Set<PaymentMethod>().Add(paymentMethod);
        _dataContext.SaveChanges();

        response.Data = paymentMethod;
        return Ok(response);
    }
}