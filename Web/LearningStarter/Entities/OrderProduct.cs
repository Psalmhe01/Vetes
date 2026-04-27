using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class OrderProduct
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductSizeId { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }

    public virtual Orders Order { get; set; }
    public virtual ProductSize ProductSize { get; set; }
}

public class OrderProductGetDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductSizeId { get; set; }
    public string ProductName { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}

public class OrderProductCreateDto
{
    public int OrderId { get; set; }
    public int ProductSizeId { get; set; }
    public int Quantity { get; set; }
    
}

public class OrderProductEntityTypeConfiguration : IEntityTypeConfiguration<OrderProduct>
{
    public void Configure(EntityTypeBuilder<OrderProduct> builder)
    {
        builder.ToTable("OrderProducts");

        builder.HasOne(x => x.Order)
            .WithMany()
            .HasForeignKey(x => x.OrderId);

        builder.HasOne(x => x.ProductSize)
            .WithMany()
            .HasForeignKey(x => x.ProductSizeId);
    }
}
