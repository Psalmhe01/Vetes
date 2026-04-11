using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;


public class ProductSize
{
    public int Id { get; set; }
    public int Stock { get; set; }
    
    public int SizeId { get; set; }
    public Size  Size { get; set; }
    
    public int ProductId { get; set; }
    public Product Product{ get; set; }
    public List<ProductSizeMeasurement> Measurements { get; set; }
}

public class ProductSizeGetDto
{
    public int Id { get; set; }
    public int Stock { get; set; }
    public int SizeId { get; set; }
    public int ProductId { get; set; }
    public string SizeName { get; set; }
    public string ProductName { get; set; }
    public decimal ProductPrice { get; set; }
    
}

// Used inside SizeGetDto — only shows product info (size is already known from context)
public class ProductSizeForSizeGetDto
{
    public int Id { get; set; }
    public int Stock { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public string ProductDescription { get; set; }
    public decimal ProductPrice { get; set; }
}

// Used inside ProductGetDto — only shows size info (product is already known from context)
public class ProductSizeForProductGetDto
{
    public int Id { get; set; }
    public int Stock { get; set; }
    public int SizeId { get; set; }
    public string SizeName { get; set; }
    public List<ProductSizeMeasurementForSizeGetDto> Measurements { get; set; }
}

public class ProductSizeCreateDto
{
    public int Stock { get; set; }
    public int SizeId { get; set; }
    public int ProductId{ get; set; }
}

public class ProductSizeUpdateDto
{
    public int Stock { get; set; }
    public int  SizeId { get; set; }
    public int ProductId { get; set; }}

public class ProductSizeEntityTypeConfiguration : IEntityTypeConfiguration<ProductSize>
{
    public void Configure(EntityTypeBuilder<ProductSize> builder)
    {
        builder.ToTable("ProductSize");

        builder.HasOne(x => x.Size)
            .WithMany(x => x.Products);
        builder.HasOne(x => x.Product)
            .WithMany(x => x.Sizes);

    }
}