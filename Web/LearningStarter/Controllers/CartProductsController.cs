using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc; 
namespace LearningStarter.Controllers;

// missing above the class:
[ApiController]
[Route("api/cartproducts")]

public class CartProductsController : ControllerBase
{
    private readonly DataContext _dataContext;
    public CartProductsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _dataContext
            .Set<CartProduct>()
            .Select(cartProduct => new CartProductGetDto
            {
                Id = cartProduct.Id,
                ProductSizeId = cartProduct.ProductSizeId,
                Quantity = cartProduct.Quantity,
            }).ToList();
        
        response.Data = data;
        return Ok(response);
    }

}