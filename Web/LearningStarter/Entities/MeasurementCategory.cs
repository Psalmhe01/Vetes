using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class MeasurementCategory
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    public int MeasurementTypeId { get; set; }
    public MeasurementType MeasurementType { get; set; }
}

public class MeasurementCategoryGetDto
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public int MeasurementTypeId { get; set; }
}

public class MeasurementCategoryCreateDto
{
    public int CategoryId { get; set; }
    public int MeasurementTypeId { get; set; }
}

public class MeasurementCategoryDeleteDto
{
    public int CategoryId { get; set; }
    public int MeasurementTypeId { get; set; }
}

public class MeasurementCategoryEntityTypeConfiguration : IEntityTypeConfiguration<MeasurementCategory>
{
    public void Configure(EntityTypeBuilder<MeasurementCategory> builder)
    {
        builder.ToTable("MeasurementCategories");

        builder.HasOne(x => x.Category)
            .WithMany();
            
        builder.HasOne(x => x.MeasurementType)
            .WithMany();    
    }
}