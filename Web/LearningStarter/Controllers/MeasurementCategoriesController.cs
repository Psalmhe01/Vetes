using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/measurementcategories")]

public class MeasurementCategoriesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public MeasurementCategoriesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<MeasurementCategory>()
            .Select(measurementcategory => new MeasurementCategoryGetDto
            {
                Id = measurementcategory.Id,
                CategoryId = measurementcategory.CategoryId,
                MeasurementTypeId = measurementcategory.MeasurementTypeId
            }).ToList();
        response.Data = data;
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<MeasurementCategory>()
            .Select(measurementcategory => new MeasurementCategoryGetDto
            {
                Id = measurementcategory.Id,
                CategoryId = measurementcategory.CategoryId,
                MeasurementTypeId = measurementcategory.MeasurementTypeId
            }).FirstOrDefault(x => x.Id == id);
        if (data == null)
        {
            response.AddError("id", "Id not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        response.Data = data;
        return Ok(response);
    }
    
    [HttpPost]
    public IActionResult Create([FromBody] MeasurementCategoryCreateDto createDto)
    {
        var response = new Response();
        
        var categoryExists = _dataContext.Set<Category>()
            .Any(c => c.Id == createDto.CategoryId);
        if (!categoryExists)
        {
            response.AddError(nameof(createDto.CategoryId), "Category does not exist");
        }
        
        var measurementTypeExists = _dataContext.Set<MeasurementType>()
            .Any(c => c.Id == createDto.MeasurementTypeId);
        if (!measurementTypeExists)
        {
            response.AddError(nameof(createDto.MeasurementTypeId), "Measurement Type does not exist");
        }
        
        var ruleExists = _dataContext.Set<MeasurementCategory>()
            .Any(x => x.CategoryId == createDto.CategoryId &&
                      x.MeasurementTypeId == createDto.MeasurementTypeId);
        if (ruleExists)
        {
            response.AddError("","Rule already exists");
        }
        
        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var measurementCategoryToCreate = new MeasurementCategory
        {
            CategoryId = createDto.CategoryId,
            MeasurementTypeId = createDto.MeasurementTypeId
        };
        
        _dataContext.Set<MeasurementCategory>().Add(measurementCategoryToCreate);
        _dataContext.SaveChanges();

        var measurementCategoryToReturn = new MeasurementCategoryGetDto
        {
            Id = measurementCategoryToCreate.Id,
            CategoryId = measurementCategoryToCreate.CategoryId,
            MeasurementTypeId = measurementCategoryToCreate.MeasurementTypeId
        };
        
        response.Data = measurementCategoryToReturn;
        return Created("", response);
    }
    
    
    
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        
        var measurementCategoryToDelete = _dataContext.Set<MeasurementCategory>()
            .FirstOrDefault(x => x.Id == id);

        if (measurementCategoryToDelete == null)
        {
            response.AddError("id", "Id not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<MeasurementCategory>().Remove(measurementCategoryToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}