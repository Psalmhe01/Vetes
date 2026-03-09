using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;


public class Size
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public List<ProductSize> Products  { get; set; }
}

public class SizeGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<ProductSizeForSizeGetDto> Products { get; set; }

}

public class SizeCreateDto
{
    public string Name { get; set; }

}

public class SizeUpdateDto
{
    public string Name { get; set; }
}

public class SizeEntityTypeConfiguration : IEntityTypeConfiguration<Size>
{
    public void Configure(EntityTypeBuilder<Size> builder)
    {
        builder.ToTable("Size");
    }
}