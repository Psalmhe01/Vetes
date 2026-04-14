using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Ads
{
    public int Id { get; set; }
    public string Title { get; set;}
    public string LinkUrl {get; set;}
    
    public int ImageId {get; set;}
    public AdImages Image { get; set; }
    
    public int PlacementId {get; set; }
    public AdPlacements Placement {get; set;}
    
    public string Description {get; set; }
}
public class AdGetDto
{
    public int Id {get; set;}
    public string Title {get; set;}
    public string LinkUrl {get; set; }
    public int ImageId {get; set;}
    public int PlacementId {get; set;}
    
    
}

public class AdsCreateDto
{
    //public int Id {get; set;}
    public string LinkUrl {get; set;}
    public string Description {get; set; }
    public int ImageId {get; set;}
    public int PlacementId {get; set;}
    
}
public class AdsUpdateDto
{
    public int Id {get; set;}
    public string Url {get; set;}
    public string Description {get; set; }
    public int ImageId {get; set;}
    public int PlacementId {get; set;}
}

public class AdsEntityTypeConfiguration : IEntityTypeConfiguration<Ads>
{
    public void Configure(EntityTypeBuilder<Ads> builder)
    {
        builder.ToTable("Ads");
    }
        
}