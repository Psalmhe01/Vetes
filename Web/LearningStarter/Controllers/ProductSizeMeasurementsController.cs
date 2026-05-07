using System.Linq;
using System.Runtime.InteropServices;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/productsizemeasurements")]

public class ProductSizeMeasurementsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ProductSizeMeasurementsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<ProductSizeMeasurement>()
            .Select(productSizeMeasurement => new ProductSizeMeasurementGetDto
            {
                Id = productSizeMeasurement.Id,
                ProductSizeId = productSizeMeasurement.ProductSizeId,
                MeasurementTypeId = productSizeMeasurement.MeasurementTypeId,
                Value = productSizeMeasurement.Value
            }).ToList();

        response.Data = data;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<ProductSizeMeasurement>()
            .Select(productSizeMeasurement => new ProductSizeMeasurementGetDto
            {
                Id = productSizeMeasurement.Id,
                ProductSizeId = productSizeMeasurement.ProductSizeId,
                MeasurementTypeId = productSizeMeasurement.MeasurementTypeId,
                Value = productSizeMeasurement.Value
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
    public IActionResult Create([FromBody] ProductSizeMeasurementCreateDto createDto)
    {
        var response = new Response();

        var measurementTypeExists = _dataContext.Set<MeasurementType>()
            .Any(m => m.Id == createDto.MeasurementTypeId);

        if (!measurementTypeExists)
        {
            response.AddError(nameof(createDto.MeasurementTypeId), "Measurement Type doesn't exist");
        }

        var productSizeExists = _dataContext.Set<ProductSize>()
            .Any(ps => ps.Id == createDto.ProductSizeId);

        if (!productSizeExists)
        {
            response.AddError(nameof(createDto.ProductSizeId), "Product Size doesn't exist");
        }

        if (createDto.Value <= 0)
        {
            response.AddError(nameof(createDto.Value), "Value must be greater than zero");
        }

        var exists = _dataContext.Set<ProductSizeMeasurement>()
            .Any(x => x.ProductSizeId == createDto.ProductSizeId &&
                      x.MeasurementTypeId == updateDto.MeasurementTypeId &&
                      x.Id != id);
        if (exists)
        {
            response.AddError("MeasurementTypeId", "Measurement already exists for this product");
        }

        var productSize = _dataContext
            .Set<ProductSize>()
            .FirstOrDefault(x => x.Id == createDto.ProductSizeId);

        if (productSize == null)
        {
            response.AddError(nameof(createDto.ProductSizeId), "Product size not found");
        }

        var product = _dataContext
            .Set<Product>()
            .FirstOrDefault(x => x.Id == productSize.ProductId);

        var allowed = _dataContext
            .Set<MeasurementCategory>()
            .Any(mc => mc.CategoryId == product.CategoryId && mc.MeasurementTypeId == createDto.MeasurementTypeId);

        if (!allowed)
        {
            response.AddError(nameof(createDto.MeasurementTypeId), "Measurement Type not allowed for this category");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        var productSizeMeasurementToCreate = new ProductSizeMeasurement
        {
            ProductSizeId = createDto.ProductSizeId,
            MeasurementTypeId = createDto.MeasurementTypeId,
            Value = createDto.Value
        };

        _dataContext.Set<ProductSizeMeasurement>().Add(productSizeMeasurementToCreate);
        _dataContext.SaveChanges();

        var productSizeMeasurementToReturn = new ProductSizeMeasurementGetDto
        {
            Id = productSizeMeasurementToCreate.Id,
            ProductSizeId = productSizeMeasurementToCreate.ProductSizeId,
            MeasurementTypeId = productSizeMeasurementToCreate.MeasurementTypeId,
            Value = productSizeMeasurementToCreate.Value
        };

        response.Data = productSizeMeasurementToReturn;
        return Created("", response);
    }

    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ProductSizeMeasurementUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        var measurementTypeExists = _dataContext.Set<MeasurementType>()
            .Any(m => m.Id == updateDto.MeasurementTypeId);

        if (!measurementTypeExists)
        {
            response.AddError(nameof(updateDto.MeasurementTypeId), "Measurement Type doesn't exist");
        }

        var productSizeExists = _dataContext.Set<ProductSize>()
            .Any(ps => ps.Id == updateDto.ProductSizeId);

        if (!productSizeExists)
        {
            response.AddError(nameof(updateDto.ProductSizeId), "Product Size doesn't exist");
        }

        if (updateDto.Value <= 0)
        {
            response.AddError(nameof(updateDto.Value), "Value must be greater than zero");
        }

        var exists = _dataContext.Set<ProductSizeMeasurement>()
            .Any(x => x.ProductSizeId == updateDto.ProductSizeId &&
                      x.MeasurementTypeId == updateDto.MeasurementTypeId &&
                      x.Id != id);
        if (exists)
        {
            response.AddError("MeasurementTypeId", "Measurement already exists for this product");
        }

        var productSize = _dataContext
            .Set<ProductSize>()
            .FirstOrDefault(x => x.Id == updateDto.ProductSizeId);

        if (productSize == null)
        {
            response.AddError(nameof(updateDto.ProductSizeId), "Product size not found");
        }

        var product = _dataContext
            .Set<Product>()
            .FirstOrDefault(x => x.Id == productSize.ProductId);

        var allowed = _dataContext
            .Set<MeasurementCategory>()
            .Any(mc => mc.CategoryId == product.CategoryId && mc.MeasurementTypeId == updateDto.MeasurementTypeId);

        if (!allowed)
        {
            response.AddError(nameof(updateDto.MeasurementTypeId), "Measurement Type not allowed for this category");
        }
        
        var productSizeMeasurementToUpdate = _dataContext
            .Set<ProductSizeMeasurement>()
            .FirstOrDefault(x => x.Id == id);

        if (productSizeMeasurementToUpdate == null)
        {
            response.AddError("id", "Id is required");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        
        productSizeMeasurementToUpdate.ProductSizeId = updateDto.ProductSizeId;
        productSizeMeasurementToUpdate.MeasurementTypeId = updateDto.MeasurementTypeId;
        productSizeMeasurementToUpdate.Value = updateDto.Value;

        _dataContext.SaveChanges();
        var productSizeMeasurementToReturn = new ProductSizeMeasurementGetDto
        {
            Id = productSizeMeasurementToUpdate.Id,
            ProductSizeId = productSizeMeasurementToUpdate.ProductSizeId,
            MeasurementTypeId = productSizeMeasurementToUpdate.MeasurementTypeId,
            Value = productSizeMeasurementToUpdate.Value
        };

        response.Data = productSizeMeasurementToReturn;
        return Ok(response);
    }
    
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        
        var productSizeMeasurement = _dataContext.Set<ProductSizeMeasurement>()
            .FirstOrDefault(x => x.Id == id);

        if (productSizeMeasurement == null)
        {
            response.AddError("id", "Id not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<ProductSizeMeasurement>().Remove(productSizeMeasurement);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok(response);
    }
}