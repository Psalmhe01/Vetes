using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ProductsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<Products>()
            .Select(products => new ProductsGetDto
            {
                Id = products.Id,
                Name = products.Name,
                Description = products.Description,
                Price = products.Price,
                CategoryId = products.CategoryId
            }).ToList();

        response.Data = data;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<Products>()
            .Select(products => new ProductsGetDto
            {
                Id = products.Id,
                Name = products.Name,
                Description = products.Description,
                Price = products.Price,
                CategoryId = products.CategoryId
            }).ToList();

        response.Data = data;
        return Ok(response);
    }
    // make httppost, validate name, price, categoryid exists
}