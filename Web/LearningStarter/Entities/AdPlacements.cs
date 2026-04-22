using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace LearningStarter.Entities;

public class AdPlacements
{
    public int Id {get; set; }
    public string Name {get; set; }
    public string Description { get; set; }
}
public class AdPlacementsGetDto
{
    public int Id {get; set;}
    public string Name {get; set;}
    public string Description {get; set; }
    
}

public class AdPlacementsCreateDto
{
    public string Name {get; set;}
    public string Description {get; set; }
    
}
public class AdPlacementsUpdateDto
{
    public string Name {get; set; }
    public string Description { get; set;}
}

public class AdPlacementsEntityTypeConfiguration : IEntityTypeConfiguration<AdPlacements>
{
    public void Configure(EntityTypeBuilder<AdPlacements> builder)
    {
        builder.ToTable("AdPlacements");
    }
        
}