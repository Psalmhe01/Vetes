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
                .Set<Categories>()
                .Select(categories => new CategoriesGetDto
                {
                    Id = categories.Id,
                    Name = categories.Name,
                    Products = categories.Products.Select(product => new ProductsGetDto
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

    // think about swapping up the intrinsic meat of the regular get with the get by id and vice versa
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
            
        var data = _dataContext
            .Set<Categories>()
            .Select(categories => new CategoriesGetDto
            {
                Id = categories.Id,
                Name = categories.Name
            })
            .FirstOrDefault(categories => categories.Id == id);
        
        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] CategoriesCreateDto createDto)
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

        var categoriesToCreate = new Categories
        {
            Name = createDto.Name
        };

        _dataContext.Set<Categories>().Add(categoriesToCreate);
        _dataContext.SaveChanges();

        var categoriesToReturn = new CategoriesGetDto
        {
            Id = categoriesToCreate.Id,
            Name = categoriesToCreate.Name
        };

        response.Data = categoriesToReturn;
        
        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] CategoriesUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name is required");
        }
        
        var categoriesToUpdate = _dataContext.Set<Categories>()
            .FirstOrDefault(categories => categories.Id == id);
        
        if (categoriesToUpdate == null)
        {
            response.AddError("id", "Category not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        categoriesToUpdate.Name = updateDto.Name;

        _dataContext.SaveChanges();

        var categoriesToReturn = new CategoriesGetDto
        {
            Id = categoriesToUpdate.Id,
            Name = categoriesToUpdate.Name
        };
        
        response.Data = categoriesToReturn;
        
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var categoriesToDelete = _dataContext.Set<Categories>()
            .FirstOrDefault(categories => categories.Id == id);

        if (categoriesToDelete == null)
        {
            response.AddError("id", "Category not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<Categories>().Remove(categoriesToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }
}