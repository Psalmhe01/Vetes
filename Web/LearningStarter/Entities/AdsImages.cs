using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace LearningStarter.Entities;

public class AdImages
{
    public int Id {get; set; }
    public string Url {get; set; }
    public string Description { get; set; }
}
public class AdImagesGetDto
{
    public int Id {get; set;}
    public string Url {get; set;}
    public string Description {get; set; }
    
}

public class AdImagesCreateDto
{
    public string Url {get; set;}
    public string Description {get; set; }
    
}
public class AdImagesUpdateDto
{
    public string Url {get; set; }
    public string Description { get; set;}
}

public class AdImagesEntityTypeConfiguration : IEntityTypeConfiguration<AdImages>
{
    public void Configure(EntityTypeBuilder<AdImages> builder)
    {
        builder.ToTable("AdImages");
    }
        
}