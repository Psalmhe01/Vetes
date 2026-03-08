using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/shipping-addresses")]
public class ShippingAddressesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ShippingAddressesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<ShippingAddresses>()
            .Select(address => new ShippingAddressesGetDto
            {
                Id = address.Id,
                UserId = address.UserId,
                AddressLine1 = address.AddressLine1,
                AddressLine2 = address.AddressLine2,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country
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
            .Set<ShippingAddresses>()
            .Select(address => new ShippingAddressesGetDto
            {
                Id = address.Id,
                UserId = address.UserId,
                AddressLine1 = address.AddressLine1,
                AddressLine2 = address.AddressLine2,
                City = address.City,
                State = address.State,
                PostalCode = address.PostalCode,
                Country = address.Country
            })
            .FirstOrDefault(shippingAddresses => shippingAddresses.Id == id);

        if (data == null)
        {
            response.AddError("id", "Address not found.");
            return NotFound(response);
        }

        response.Data = data;
        return Ok(response);
    }

    [HttpPost]
    public IActionResult Create([FromBody] ShippingAddressesCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.AddressLine1))
        {
            response.AddError(nameof(createDto.AddressLine1), "Address Line 1 cannot be empty");
        }
        
        if (string.IsNullOrEmpty(createDto.City))
        {
            response.AddError(nameof(createDto.City), "City cannot be empty");
        }

        if (string.IsNullOrEmpty(createDto.State))
        {
            response.AddError(nameof(createDto.State), "State cannot be empty");
        }
        
        if (string.IsNullOrEmpty(createDto.PostalCode))
        {
            response.AddError(nameof(createDto.PostalCode), "Postal Code cannot be empty");
        }
        
        if (string.IsNullOrEmpty(createDto.Country))
        {
            response.AddError(nameof(createDto.Country), "Country cannot be empty");
        }
        
        var userExists = _dataContext.Set<User>().Any(x => x.Id == createDto.UserId);
        if (!userExists)
        {
            response.AddError(nameof(createDto.UserId), "User does not exist.");
        }
        
        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var addressToCreate = new ShippingAddresses
        {
            UserId = createDto.UserId,
            AddressLine1 = createDto.AddressLine1,
            AddressLine2 = createDto.AddressLine2,
            City = createDto.City,
            State = createDto.State,
            PostalCode = createDto.PostalCode,
            Country = createDto.Country
        };

        _dataContext.Set<ShippingAddresses>().Add(addressToCreate);
        _dataContext.SaveChanges();

        var addressToReturn = new ShippingAddressesGetDto
        {
            Id = addressToCreate.Id,
            UserId = addressToCreate.UserId,
            AddressLine1 = addressToCreate.AddressLine1,
            AddressLine2 = addressToCreate.AddressLine2,
            City = addressToCreate.City,
            State = addressToCreate.State,
            PostalCode = addressToCreate.PostalCode,
            Country = addressToCreate.Country
        };

        response.Data = addressToReturn;
        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ShippingAddressesCreateDto updateDto, int id) 
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.AddressLine1))
        {
            response.AddError(nameof(updateDto.AddressLine1), "Address Line 1 cannot be empty");
        }
        
        if (string.IsNullOrEmpty(updateDto.City))
        {
            response.AddError(nameof(updateDto.City), "City cannot be empty");
        }

        if (string.IsNullOrEmpty(updateDto.State))
        {
            response.AddError(nameof(updateDto.State), "State cannot be empty");
        }
        
        if (string.IsNullOrEmpty(updateDto.PostalCode))
        {
            response.AddError(nameof(updateDto.PostalCode), "Postal Code cannot be empty");
        }
        
        if (string.IsNullOrEmpty(updateDto.Country))
        {
            response.AddError(nameof(updateDto.Country), "Country cannot be empty");
        }

        var addressToUpdate = _dataContext.Set<ShippingAddresses>()
            .FirstOrDefault(shippingAddresses => shippingAddresses.Id == id);

        if (addressToUpdate == null)
        {
            response.AddError("id", "Address not found.");
            return NotFound(response);
        }
        
        addressToUpdate.AddressLine1 = updateDto.AddressLine1;
        addressToUpdate.AddressLine2 = updateDto.AddressLine2;
        addressToUpdate.City = updateDto.City;
        addressToUpdate.State = updateDto.State;
        addressToUpdate.PostalCode = updateDto.PostalCode;
        addressToUpdate.Country = updateDto.Country;

        _dataContext.SaveChanges();

        var addressToReturn = new ShippingAddressesGetDto
        {
            Id = addressToUpdate.Id,
            UserId = addressToUpdate.UserId,
            AddressLine1 = addressToUpdate.AddressLine1,
            AddressLine2 = addressToUpdate.AddressLine2,
            City = addressToUpdate.City,
            State = addressToUpdate.State,
            PostalCode = addressToUpdate.PostalCode,
            Country = addressToUpdate.Country
        };

        response.Data = addressToReturn;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var addressToDelete = _dataContext.Set<ShippingAddresses>()
            .FirstOrDefault(x => x.Id == id);

        if (addressToDelete == null)
        {
            response.AddError("id", "Address not found.");
            return NotFound(response);
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<ShippingAddresses>().Remove(addressToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}