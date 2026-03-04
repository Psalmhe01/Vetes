using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Product> Product { get; set; }
}

public class CategoryGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<ProductGetDto> Products { get; set; }
}

public class CategoryCreateDto
{
    public string Name { get; set; }
}

public class CategoryUpdateDto
{
    public string Name { get; set; }
}

public class CategoryEntityTypeConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Category");
    }
}