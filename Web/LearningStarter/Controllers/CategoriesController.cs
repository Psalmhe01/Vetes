using System.ComponentModel;
using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
namespace LearningStarter.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public CategoriesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
            
            var data = _dataContext
                .Set<Category>()
                .Include(c => c.Product) // Include the related products
                .Select(category => new CategoryGetDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Products = category.Product.Select(product => new ProductGetDto
                    {
                        Id = product.Id,
                        Name = product.Name,
                        Description = product.Description,
                        Price = product.Price,
                        CategoryId = product.CategoryId
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
            .Set<Category>()
            .Include(c => c.Product) // Include the related products
            .Select(category => new CategoryGetDto
            {
                Id = category.Id,
                Name = category.Name,
                Products = category.Product.Select(product => new ProductGetDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    CategoryId = product.CategoryId
                }).ToList()
            })
            .FirstOrDefault(categories => categories.Id == id);
        if (data == null)
        {
            response.AddError("id", "Category not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CategoryCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name is required");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        };

        var categoryToCreate = new Category
        {
            Name = createDto.Name
        };

        _dataContext.Set<Category>().Add(categoryToCreate);
        _dataContext.SaveChanges();

        var categoryToReturn = new CategoryGetDto
        {
            Id = categoryToCreate.Id,
            Name = categoryToCreate.Name
        };

        response.Data = categoryToReturn;
        
        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] CategoryUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name is required");
        }
        
        var categoryToUpdate = _dataContext.Set<Category>()
            .FirstOrDefault(category => category.Id == id);
        
        if (categoryToUpdate == null)
        {
            response.AddError("id", "Category not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        categoryToUpdate.Name = updateDto.Name;

        _dataContext.SaveChanges();

        var categoryToReturn = new CategoryGetDto
        {
            Id = categoryToUpdate.Id,
            Name = categoryToUpdate.Name
        };
        
        response.Data = categoryToReturn;
        
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var categoryToDelete = _dataContext.Set<Category>()
            .FirstOrDefault(category => category.Id == id);

        if (categoryToDelete == null)
        {
            response.AddError("id", "Category not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Category>().Remove(categoryToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }
}