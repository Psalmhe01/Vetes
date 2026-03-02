using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
namespace LearningStarter.Controllers;

[ApiController]
[Route("api/cart")]

public class CartsController : ControllerBase
{
    private readonly DataContext _dataContext;
    public CartsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _dataContext
            .Set<Cart>()
            .Select(cart => new CartGetDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                UpdatedAt = cart.UpdatedAt,
                /*Products = cart.Products.Select(x => new CartProductGetDto
                {
                    Id = x.Id,
                    CartId = x.CartId,
                    ProductSizeId = x.ProductSizeId,
                    Quantity = x.Quantity
                }).ToList()*/
            })
            .ToList();
        
        response.Data = data;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var data = _dataContext
            .Set<Cart>()
            .Select(cart => new CartGetDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                UpdatedAt = cart.UpdatedAt,
            }).FirstOrDefault(cart => cart.Id == id);
        
        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CartCreateDto createDto)
    {
        var response = new Response();

        if (createDto.UserId < 0)
        {
            response.AddError("UserId", "UserId must be positive");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var cartToCreate = new Cart
        {
            UserId = createDto.UserId,
            UpdatedAt = createDto.UpdatedAt,
        };
        
        _dataContext.Set<Cart>().Add(cartToCreate);
        _dataContext.SaveChanges();

        var cartToReturn = new CartGetDto
        {
            Id = cartToCreate.Id,
            UserId = createDto.UserId,
            UpdatedAt = createDto.UpdatedAt
        };
        
        response.Data = cartToReturn;
        
        return Created("", response);
    }
    
    [HttpPut("{id}")]
        public IActionResult Update([FromBody] CartUpdateDto updateDto, int id)
        {
            var response = new Response();
            var cartToUpdate = _dataContext.Set<Cart>()
                .FirstOrDefault(cart => cart.Id == id);
            
            if (cartToUpdate == null)
            {
                response.AddError("id", "Cart not found.");
            }
            
            if (updateDto.UserId < 0)
            {
                response.AddError("UserId", "UserId must be positive");
            }
            
            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            cartToUpdate.UpdatedAt = updateDto.UpdatedAt;
            cartToUpdate.UserId = updateDto.UserId;

            _dataContext.SaveChanges();

            var cartToReturn = new CartGetDto
            {
                Id = cartToUpdate.Id,
                UserId = cartToUpdate.UserId,
                UpdatedAt = cartToUpdate.UpdatedAt
            };
            
            response.Data = cartToReturn;
            return Ok(response);
        }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var cartToDelete = _dataContext.Set<Cart>()
            .FirstOrDefault(cart => cart.Id == id);

        if (cartToDelete == null)
        {
            response.AddError("id", "Cart not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Cart>().Remove(cartToDelete);
        _dataContext.SaveChanges();
        response.Data = true;
        return Ok(response);
    }
}