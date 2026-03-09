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
                Name = cartProduct.ProductSize.Product.Name,
                Size = cartProduct.ProductSize.Size.Name,
                Price = cartProduct.ProductSize.Product.Price,
                Quantity = cartProduct.Quantity,
            }).ToList();
        
        response.Data = data;
        return Ok(response);
    }
    
    [HttpPost]
    public IActionResult Create([FromBody] CartProductCreateDto createDto)
    {
        var response = new Response();

        if (createDto.Quantity <= 0)
        {
            response.AddError(nameof(createDto.Quantity), "Quantity must be greater than 0");
        }
        
        var productExists = _dataContext.Set<ProductSize>()
            .Any(c => c.Id == createDto.ProductSizeId);
        
        var cartExists = _dataContext.Set<Cart>()
                    .Any(c => c.Id == createDto.CartId);
        
        if (!productExists)
        {
            response.AddError(
                nameof(createDto.ProductSizeId), "Product does not exist");
        }
        
        if (!cartExists)
        {
            response.AddError(
                nameof(createDto.CartId), "Cart does not exist");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        };

        var cartProductToCreate = new CartProduct
        {
            CartId = createDto.CartId,
            ProductSizeId = createDto.ProductSizeId,
            Quantity = createDto.Quantity
        };

        _dataContext.Set<CartProduct>().Add(cartProductToCreate);
        _dataContext.SaveChanges();

        var cartProductToReturn = _dataContext.Set<CartProduct>()
            .Where(cp => cp.Id == cartProductToCreate.Id)
            .Select(cp => new CartProductGetDto
            {
                Id = cp.Id,
                ProductSizeId = cp.ProductSizeId,
                Name = cp.ProductSize.Product.Name,
                Size = cp.ProductSize.Size.Name,
                Price = cp.ProductSize.Product.Price,
                Quantity = cp.Quantity,
            }).FirstOrDefault();

        response.Data = cartProductToReturn;
        
        return Created("", response);
    }
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] CartProductUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        
        var cartProductToUpdate = _dataContext.Set<CartProduct>()
            .FirstOrDefault(product => product.Id == id);
        
        if (cartProductToUpdate == null)
        {
            response.AddError("id", "Product not found");
        }
        
        if (updateDto.Quantity <= 0)
        {
            response.AddError(nameof(updateDto.Quantity), "Quantity must be greater than 0");
        }
                
        var productExists = _dataContext.Set<ProductSize>()
            .Any(c => c.Id == updateDto.ProductSizeId);
        
        var cartExists = _dataContext.Set<Cart>()
            .Any(c => c.Id == updateDto.CartId);
                
        if (!productExists)
        {
            response.AddError(
                nameof(updateDto.ProductSizeId), "Product does not exist");
        }
                
        if (!cartExists)
        {
            response.AddError(
                nameof(updateDto.CartId), "Cart does not exist");
        }
        
        if (response.HasErrors)
        {
            return BadRequest(response);
        };
                

        cartProductToUpdate.CartId = updateDto.CartId;
        cartProductToUpdate.ProductSizeId = updateDto.ProductSizeId;
        cartProductToUpdate.Quantity = updateDto.Quantity;

        _dataContext.SaveChanges();

        var cartProductToReturn = _dataContext.Set<CartProduct>()
            .Where(cp => cp.Id == id)
            .Select(cp => new CartProductGetDto
            {
                Id = cp.Id,
                ProductSizeId = cp.ProductSizeId,
                Name = cp.ProductSize.Product.Name,
                Size = cp.ProductSize.Size.Name,
                Price = cp.ProductSize.Product.Price,
                Quantity = cp.Quantity,
            }).FirstOrDefault();
        
        response.Data = cartProductToReturn;
        
        return Ok(response);
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var cartProductToDelete = _dataContext.Set<CartProduct>()
            .FirstOrDefault(product => product.Id == id);

        if (cartProductToDelete == null)
        {
            response.AddError("id", "Product not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<CartProduct>().Remove(cartProductToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }

}