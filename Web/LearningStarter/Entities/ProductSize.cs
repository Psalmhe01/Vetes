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
    public Products Product{ get; set; }
}

public class ProductSizeGetDto
{
    public int Id { get; set; }
    public int Stock { get; set; }
    public int  SizeId { get; set; }
    public int ProductId { get; set; }
}

/*public class ProductSizeCreateDto
{
    public int Stock { get; set; }
    public Size  Size { get; set; }
    public Products Product{ get; set; }
}

public class ProductSizeUpdateDto
{
    public int Stock { get; set; }
    public Size  Size { get; set; }
    public Products Product{ get; set; }}*/

public class ProductSizeEntityTypeConfiguration : IEntityTypeConfiguration<ProductSize>
{
    public void Configure(EntityTypeBuilder<ProductSize> builder)
    {
        builder.ToTable("ProductSize");

        builder.HasOne(x => x.Size)
            .WithMany(x => x.Products);
    }
}