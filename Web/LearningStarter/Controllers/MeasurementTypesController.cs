using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/measurementtypes")]
public class MeasurementTypesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public MeasurementTypesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<MeasurementType>()
            .Select(measurementtype => new MeasurementTypeGetDto
            {
                Id = measurementtype.Id,
                Name = measurementtype.Name,
                Unit = measurementtype.Unit
            }).ToList();
        response.Data = data;
        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<MeasurementType>()
            .Select(measurementtype => new MeasurementTypeGetDto
            {
                Id = measurementtype.Id,
                Name = measurementtype.Name,
                Unit =  measurementtype.Unit
            }).FirstOrDefault(x => x.Id == id);
        if (data == null)
        {
            response.AddError("id", "Id is required");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] MeasurementTypeCreateDto createDto)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name is required");
        }
        
        if (string.IsNullOrEmpty(createDto.Unit))
        {
            response.AddError(nameof(createDto.Unit), "Unit is required");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var measurementTypeToCreate = new MeasurementType
        {
            Name = createDto.Name,
            Unit = createDto.Unit
        };
        
        _dataContext.Set<MeasurementType>().Add(measurementTypeToCreate);
        _dataContext.SaveChanges();

        var measurementTypeToReturn = new MeasurementTypeGetDto
        {
            Id = measurementTypeToCreate.Id,
            Name = measurementTypeToCreate.Name,
            Unit = measurementTypeToCreate.Unit
        };
        
        response.Data = measurementTypeToReturn;
        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] MeasurementTypeUpdateDto updateDto, int id)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name is required");
        }
        
        if (string.IsNullOrEmpty(updateDto.Unit))
        {
            response.AddError(nameof(updateDto.Unit), "unit is required");
        }
        
        var measurementTypeToUpdate = _dataContext
            .Set<MeasurementType>()
            .FirstOrDefault(x => x.Id == id);

        if (measurementTypeToUpdate == null)
        {
            response.AddError("id", "Id is required");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        measurementTypeToUpdate.Name = updateDto.Name;
        measurementTypeToUpdate.Unit = updateDto.Unit;

        _dataContext.SaveChanges();

        var measurementTypeToReturn = new MeasurementTypeGetDto
        {
            Id = measurementTypeToUpdate.Id,
            Name = measurementTypeToUpdate.Name,
            Unit = measurementTypeToUpdate.Unit
        };
        
        response.Data = measurementTypeToReturn;
        return Ok(response);

    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        
        var measurementTypeToDelete = _dataContext.Set<MeasurementType>()
            .FirstOrDefault(x => x.Id == id);

        if (measurementTypeToDelete == null)
        {
            response.AddError("id", "Id is required");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<MeasurementType>().Remove(measurementTypeToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}