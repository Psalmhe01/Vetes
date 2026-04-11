using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class ProductSizeMeasurement
{
    public int Id { get; set; }
    public int ProductSizeId { get; set; }
    public ProductSize ProductSize { get; set; }
    public int MeasurementTypeId { get; set; }
    public MeasurementType MeasurementType { get; set; }
    public decimal Value { get; set; }
}
public class ProductSizeMeasurementForSizeGetDto
{
    public int Id { get; set; }
    public string MeasurementTypeName { get; set; }
    public string MeasurementTypeUnit { get; set; }
    public decimal Value { get; set; }
}

public class ProductSizeMeasurementGetDto
{
    public int Id { get; set; }
    public int ProductSizeId { get; set; }
    public int MeasurementTypeId { get; set; }
    public decimal Value { get; set; }
}

public class ProductSizeMeasurementCreateDto
{
    public int ProductSizeId { get; set; }
    public int MeasurementTypeId { get; set; }
    public decimal Value { get; set; }
}

public class ProductSizeMeasurementUpdateDto
{
    public int ProductSizeId { get; set; }
    public int MeasurementTypeId { get; set; }
    public decimal Value { get; set; }
}

public class ProductSizeMeasurementEntityTypeConfiguration : IEntityTypeConfiguration<ProductSizeMeasurement>
{
    public void Configure(EntityTypeBuilder<ProductSizeMeasurement> builder)
    {
        builder.ToTable("ProductSizeMeasurements");

        builder.HasOne(p => p.ProductSize)
            .WithMany(x => x.Measurements);
        
        builder.HasOne(p => p.MeasurementType)
            .WithMany();
    }
}