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
                Name = size.Name
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
            response.AddError("Name", "Size must have a value");
        }

        if (response.HasErrors)
        {
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