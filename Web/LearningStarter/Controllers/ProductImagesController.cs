using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;


namespace LearningStarter.Controllers;

[ApiController]
[Route("api/product-images")]
public class ProductImagesController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ProductImagesController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<ProductImage>()
            .Select(productImage => new ProductImagesGetDto
            {
                Id = productImage.Id,
                ProductId = productImage.ProductId,
                ImageUrl = productImage.ImageUrl
            }).ToList();

        response.Data = data;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();

        var data = _dataContext
            .Set<ProductImage>()
            .Select(productImage => new ProductImagesGetDto
            {
                Id = productImage.Id,
                ProductId = productImage.ProductId,
                ImageUrl = productImage.ImageUrl
            }).FirstOrDefault(productImage => productImage.Id == id);
        if (data == null)
        {
            response.AddError("id", "Product image not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        response.Data = data;
        return Ok(response);
    }
    [HttpPost]
    public IActionResult Create([FromBody] ProductImagesCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.ImageUrl))
        {
            response.AddError(nameof(createDto.ImageUrl), "ImageUrl is required");
        }
        
        var productExists = _dataContext
            .Set<Product>()
            .Any(product => product.Id == createDto.ProductId);
        if (!productExists)
        {
            response.AddError(nameof(createDto.ProductId), "Product does not exist");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        var productImageToCreate = new ProductImage
        {
            ProductId = createDto.ProductId,
            ImageUrl = createDto.ImageUrl
        };

        _dataContext.Set<ProductImage>().Add(productImageToCreate);
        _dataContext.SaveChanges();

        var productImageToReturn = new ProductImagesGetDto
        {
            Id = productImageToCreate.Id,
            ProductId = productImageToCreate.ProductId,
            ImageUrl = productImageToCreate.ImageUrl
        };

        response.Data = productImageToReturn;
        return Created("", response);
    }
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] ProductImagesUpdateDto updateDto, int id)
    {
        var response = new Response();
        
        if (string.IsNullOrEmpty(updateDto.ImageUrl))
        {
            response.AddError(nameof(updateDto.ImageUrl), "ImageUrl is required");
        }
        
        var productImageToUpdate = _dataContext
            .Set<ProductImage>()
            .FirstOrDefault(productImage => productImage.Id == id);
        if (productImageToUpdate == null)
        {
            response.AddError("id", "Product image not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        productImageToUpdate.ImageUrl = updateDto.ImageUrl;
       

        _dataContext.SaveChanges();

        var productToReturn = new ProductImagesGetDto
        {
            Id = productImageToUpdate.Id,
            ProductId = productImageToUpdate.ProductId,
            ImageUrl = productImageToUpdate.ImageUrl
        };
        
        response.Data = productToReturn;
        return Ok(response);
    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();

        var productImageToDelete = _dataContext
            .Set<ProductImage>()
            .FirstOrDefault(productImage => productImage.Id == id);

        if (productImageToDelete == null)
        {
            response.AddError("id", "Product image not found");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        _dataContext.Set<ProductImage>().Remove(productImageToDelete);
        _dataContext.SaveChanges();
        
        response.Data = true;
        return Ok(response);
    }
}