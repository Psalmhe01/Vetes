using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Categories
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Products> Products { get; set; }
}

public class CategoriesGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<ProductsGetDto> Products { get; set; }
}

public class CategoriesCreateDto
{
    public string Name { get; set; }
}

public class CategoriesUpdateDto
{
    public string Name { get; set; }
}

public class CategoriesEntityTypeConfiguration : IEntityTypeConfiguration<Categories>
{
    public void Configure(EntityTypeBuilder<Categories> builder)
    {
        builder.ToTable("Categories");
        builder.HasMany(x => x.Products)
            .WithOne(x => x.Categories);
    }
}