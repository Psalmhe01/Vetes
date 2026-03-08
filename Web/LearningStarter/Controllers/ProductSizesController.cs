using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/productsize")]

public class ProductSizesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ProductSizesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    /*[HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<ProductSize>()
            .Select(product => new ProductSizeGetDto
            {
                Id = product.Id,
                
            }).ToList();

        response.Data = data;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<Product>()
            .Select(product => new ProductGetDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId
            }).FirstOrDefault(x => x.Id == id);
        if (data == null)
        {
            response.AddError("id", "Product not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        response.Data = data;
        return Ok(response);
    }*/
    
    [HttpPost]
    public IActionResult Create([FromBody] ProductSizeCreateDto createDto)
    {
        var response = new Response();

        if (createDto.Stock <= 0)
        {
            response.AddError(nameof(createDto.Stock), "Stock must be greater than 0");
        }
        
        var productExists = _dataContext.Set<Product>()
            .Any(c => c.Id == createDto.ProductId);
        
        var sizeExists = _dataContext.Set<Size>()
                    .Any(c => c.Id == createDto.SizeId);
        
        if (!productExists)
        {
            response.AddError(
                nameof(createDto.ProductId), "Product does not exist");
        }
        
        if (!sizeExists)
        {
            response.AddError(
                nameof(createDto.SizeId), "Size does not exist");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        };

        var productSizeToCreate = new ProductSize
        {
            ProductId = createDto.ProductId,
            SizeId = createDto.SizeId,
            Stock = createDto.Stock
        };

        _dataContext.Set<ProductSize>().Add(productSizeToCreate);
        _dataContext.SaveChanges();

        var productSizeToReturn = new ProductSizeGetDto
        {
            Id = productSizeToCreate.Id,
            ProductId = productSizeToCreate.ProductId, 
            SizeId = productSizeToCreate.SizeId,
            Stock = productSizeToCreate.Stock
        };

        response.Data = productSizeToReturn;
        
        return Created("", response);
    }
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ProductSizeUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        
        
        var productSizeToUpdate = _dataContext.Set<ProductSize>()
            .FirstOrDefault(product => product.Id == id);
        
        if (productSizeToUpdate == null)
        {
            response.AddError("id", "Product Size not found");
        }
        
        if (updateDto.Stock <= 0)
        {
            response.AddError(nameof(updateDto.Stock), "Stock must be greater than 0");
        }
                
        var productExists = _dataContext.Set<Product>()
            .Any(c => c.Id == updateDto.ProductId);
                
        var sizeExists = _dataContext.Set<Size>()
            .Any(c => c.Id == updateDto.SizeId);
                
        if (!productExists)
        {
            response.AddError(
                nameof(updateDto.ProductId), "Product does not exist");
        }
                
        if (!sizeExists)
        {
            response.AddError(
                nameof(updateDto.SizeId), "Size does not exist");
        }
        
        if (response.HasErrors)
        {
            return BadRequest(response);
        };
                

        productSizeToUpdate.SizeId = updateDto.SizeId;
        productSizeToUpdate.ProductId = updateDto.ProductId;
        productSizeToUpdate.Stock = updateDto.Stock;

        _dataContext.SaveChanges();

        var productSizeToReturn = new ProductSizeGetDto
        {
            Id = productSizeToUpdate.Id,
            SizeId = productSizeToUpdate.SizeId,
            ProductId = productSizeToUpdate.ProductId,
            Stock = productSizeToUpdate.Stock
        };
        
        response.Data = productSizeToReturn;
        
        return Ok(response);
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var productSizeToDelete = _dataContext.Set<ProductSize>()
            .FirstOrDefault(product => product.Id == id);

        if (productSizeToDelete == null)
        {
            response.AddError("id", "Product Size not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<ProductSize>().Remove(productSizeToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }

}    