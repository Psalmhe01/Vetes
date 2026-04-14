using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class ProductImage
{
    public int Id {get; set; }
    public int ProductId { get; set; }
    public string ImageUrl {get; set;}
    
    //add after Products.cs get pushed to main
    public Product Product {get; set; }

}

public class ProductImagesGetDto
{
    public int Id {get; set;}
    public int ProductId {get; set;}
    public string ImageUrl {get; set; }
    
}

public class ProductImagesCreateDto
{
    public int ProductId {get; set;}
    public string ImageUrl {get; set; }
    
}
public class ProductImagesUpdateDto
{
    public string ImageUrl {get; set; }
}

public class ProductImagesEntityTypeConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.ToTable("ProductImages");
    }
        
}

