using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class MeasurementType
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Unit { get; set; }
    }
public class MeasurementTypeGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Unit { get; set; }
}
public class MeasurementTypeCreateDto
{
    public string Name { get; set; }
    public string Unit { get; set; }
}
public class MeasurementTypeUpdateDto
{
    public string Name { get; set; }
    public string Unit { get; set; }
}

public class MeasurementTypeEntityTypeConfiguration : IEntityTypeConfiguration<MeasurementType>
{
    public void Configure(EntityTypeBuilder<MeasurementType> builder)
    {
        builder.ToTable("MeasurementTypes");
    }
}