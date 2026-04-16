using System;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/size")]

public class SizeController : ControllerBase
{
    private readonly DataContext _dataContext;
    public SizeController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _dataContext
            .Set<Size>()
            .Select(size => new SizeGetDto
            {
                Id = size.Id,
                Name = size.Name,
                Products = size.Products.Select(x => new ProductSizeForSizeGetDto
                {
                    ProductId = x.ProductId,
                    ProductName = x.Product.Name,
                    ProductDescription = x.Product.Description,
                    ProductPrice =  x.Product.Price,
                    Stock = x.Stock
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
        var data = _dataContext
            .Set<Size>()
            .Select(size => new SizeGetDto
            {
                Id = size.Id,
                Name = size.Name,
                Products = size.Products.Select(x => new ProductSizeForSizeGetDto
                {
                ProductId = x.Product.Id,
                ProductName = x.Product.Name,
                ProductDescription = x.Product.Description,
                ProductPrice =  x.Product.Price,
                Stock = x.Stock
            }).ToList()
            }).FirstOrDefault(cart => cart.Id == id);
        
        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] SizeCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError("Name",
                "Size must have a value");
            return BadRequest(response);
        }

        var sizeToCreate = new Size
        {
            Name = createDto.Name
        };
        
        _dataContext.Set<Size>().Add(sizeToCreate);
        _dataContext.SaveChanges();

        var sizeToReturn = new SizeGetDto
        {
            Id = sizeToCreate.Id,
            Name = sizeToCreate.Name,
        };
        
        response.Data = sizeToReturn;
        
        return Created("", response);
    }

    [HttpPost("{sizeId}/product/{productId}")]
    public IActionResult AddProductToSize([FromRoute] int sizeId, int productId, [FromQuery] int stock)
    {
        var response = new Response();
        
        var size = _dataContext.Set<Size>()
            .FirstOrDefault(x => x.Id == sizeId);
        if (size == null)
        {
            response.AddError("sizeId", "Size not found");
        }
        
        var product = _dataContext.Set<Product>()
            .FirstOrDefault(x => x.Id == productId);
        if (product == null)
        {
            response.AddError("productId", "Product not found");
        }
        
        var alreadyExists = _dataContext.Set<ProductSize>()
            .Any(x => x.SizeId == sizeId && x.ProductId == productId);

        if (alreadyExists)
        {
            response.AddError("sizeId", "This size already exists for this product");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        var productSize = new ProductSize
        {
            Product = product,
            Size = size,
            Stock = stock
        };
        
        _dataContext.Set<ProductSize>().Add(productSize);
        _dataContext.SaveChanges();
        
        response.Data = new SizeGetDto
        {
            Id = size.Id,
            Name = size.Name,
            Products = size.Products.Select(x => new ProductSizeForSizeGetDto
            {
                ProductId = x.ProductId,
                ProductName = x.Product.Name, 
                ProductDescription = x.Product.Description,
                ProductPrice =  x.Product.Price,
                Stock = x.Stock
            }).ToList()
        };

        return Ok(response);

    }
    
    [HttpPut("{id}")]
        public IActionResult Update([FromBody] SizeUpdateDto updateDto, int id)
        {
            var response = new Response();
            var sizeToUpdate = _dataContext.Set<Size>()
                .FirstOrDefault(size => size.Id == id);
            
            if (sizeToUpdate == null)
            {
                response.AddError("id", "Size value not found.");
            }
            
            if (string.IsNullOrEmpty(updateDto.Name))
            {
                response.AddError("Name", "Must have a value");
            }
            
            if (response.HasErrors)
            {
                return BadRequest(response);
            }

            sizeToUpdate.Name = updateDto.Name;
            

            _dataContext.SaveChanges();

            var sizeToReturn = new SizeGetDto
            {
                Id = sizeToUpdate.Id,
                Name = sizeToUpdate.Name
            };
            
            response.Data = sizeToReturn;
            return Ok(response);
        }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var sizeToDelete = _dataContext.Set<Size>()
            .FirstOrDefault(size => size.Id == id);

        if (sizeToDelete == null)
        {
            response.AddError("id", "Size value not found.");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Size>().Remove(sizeToDelete);
        _dataContext.SaveChanges();
        response.Data = true;
        return Ok(response);
    }
}