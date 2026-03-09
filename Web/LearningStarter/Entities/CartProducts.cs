using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class CartProduct
{
    public int Id { get; set; }
    
    public int CartId { get; set; }
    public Cart Cart { get; set; }
    
    public int ProductSizeId { get; set; }
    public ProductSize ProductSize { get; set; }
    
    public int Quantity { get; set; }
}

public class CartProductGetDto
{
    public int Id { get; set; }
    public int ProductSizeId { get; set; }
    public string Name {get; set; }
    public decimal Price {get; set; }
    public string Size {get; set; }
    public int Quantity { get; set; }
}

public class CartProductCreateDto
{
    public int CartId { get; set; }
    public int ProductSizeId { get; set; }
    public int Quantity { get; set; }
}

public class CartProductUpdateDto
{
    public int CartId { get; set; }
    public int ProductSizeId { get; set; }
    public int Quantity { get; set; }
}

public class CartProductEntityTypeConfiguration : IEntityTypeConfiguration<CartProduct>
{
    public void Configure(EntityTypeBuilder<CartProduct> builder)
    {
        builder.ToTable("CartProducts");

        builder.HasOne(p => p.Cart)
            .WithMany(p => p.Products);
        
        builder.HasOne(p => p.ProductSize)
            .WithMany();
    }
}

