using System.Linq;
using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;

namespace LearningStarter.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdsController : ControllerBase
{
    private readonly DataContext _dataContext;

    public AdsController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();

        var data = _dataContext
            .Set<Ads>()
            .Select(ad => new AdGetDto
            {
                Id = ad.Id,
                Title = ad.Title,
                LinkUrl = ad.LinkUrl,
                ImageId = ad.ImageId,
                PlacementId = ad.PlacementId
            })
            .ToList();
        response.Data = data;
        return Ok(response);
    }
    [HttpPost]
    public IActionResult Create([FromBody] AdsCreateDto createDto) 
    {
        var response = new Response();
        
        var adToCreate = new Ads
        {
            LinkUrl = createDto.LinkUrl,
            Description = createDto.Description,
            ImageId = createDto.ImageId,
            PlacementId = createDto.PlacementId
        };
        _dataContext.Set<Ads>().Add(adToCreate);
        _dataContext.SaveChanges();
        
        var adToReturn = new AdGetDto
        {
            Id = adToCreate.Id,
            Title = adToCreate.Title,
            LinkUrl = adToCreate.LinkUrl,
            ImageId = adToCreate.ImageId,
            PlacementId = adToCreate.PlacementId
        };
        
        response.Data = adToReturn;
        return Created("", response);
    }
    
}