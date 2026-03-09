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
            .Set<Product>()
            .Select(product => new ProductGetDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId
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
    }
    [HttpPost]
    public IActionResult Create([FromBody] ProductCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name is required");
        }
        
        if (string.IsNullOrEmpty(createDto.Description))
        {
            response.AddError(nameof(createDto.Description), "Description is required");
        }

        if (createDto.Price <= 0)
        {
            response.AddError(nameof(createDto.Price), "Price must be greater than 0");
        }
        
        var categoryExists = _dataContext.Set<Category>()
            .Any(c => c.Id == createDto.CategoryId);
        if (!categoryExists)
        {
            response.AddError(nameof(createDto.CategoryId), "Category does not exist");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        };

        var productToCreate = new Product
        {
            Name = createDto.Name,
            Description = createDto.Description,
            Price = createDto.Price,
            CategoryId = createDto.CategoryId
        };

        _dataContext.Set<Product>().Add(productToCreate);
        _dataContext.SaveChanges();

        var productToReturn = new ProductGetDto
        {
            Id = productToCreate.Id,
            Name = productToCreate.Name,
            Description = productToCreate.Description,
            Price = productToCreate.Price,
            CategoryId = productToCreate.CategoryId
        };

        response.Data = productToReturn;
        
        return Created("", response);
    }
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ProductUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name is required");
        }
        
        if (string.IsNullOrEmpty(updateDto.Description))
        {
            response.AddError(nameof(updateDto.Name), "Description is required");
        }

        if (updateDto.Price <= 0)
        {
            response.AddError(nameof(updateDto.Price), "Price must be greater than 0");
        }
        
        var productToUpdate = _dataContext.Set<Product>()
            .FirstOrDefault(product => product.Id == id);
        
        if (productToUpdate == null)
        {
            response.AddError("id", "Product not found");
        }
        
        var categoryExists = _dataContext.Set<Category>()
            .Any(c => c.Id == updateDto.CategoryId);
        if (!categoryExists)
        {
            response.AddError(nameof(updateDto.CategoryId), "Category does not exist");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        productToUpdate.Name = updateDto.Name;
        productToUpdate.Description = updateDto.Description;
        productToUpdate.Price = updateDto.Price;
        productToUpdate.CategoryId = updateDto.CategoryId;

        _dataContext.SaveChanges();

        var productToReturn = new ProductGetDto
        {
            Id = productToUpdate.Id,
            Name = productToUpdate.Name,
            Description = productToUpdate.Description,
            Price = productToUpdate.Price,
            CategoryId = productToUpdate.CategoryId
            
        };
        
        response.Data = productToReturn;
        
        return Ok(response);
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var productToDelete = _dataContext.Set<Product>()
            .FirstOrDefault(product => product.Id == id);

        if (productToDelete == null)
        {
            response.AddError("id", "Product not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Product>().Remove(productToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }
}