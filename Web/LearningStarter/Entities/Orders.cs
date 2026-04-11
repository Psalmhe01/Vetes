using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Orders
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public int ShippingAddressId { get; set; }

    public virtual User User { get; set; }
    public virtual ShippingAddresses ShippingAddress { get; set; }

    public virtual List<Payment> Payments { get; set; } = new();
}

public class OrdersGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public int ShippingAddressId { get; set; }

    public virtual List<PaymentGetDto> Payments { get; set; } = new();

}

public class OrdersCreateDto
{
    public int UserId { get; set; }
    public string Status { get; set; }
    public int ShippingAddressId { get; set; }
}

public class OrdersUpdateDto
{
    public string Status { get; set; }
    public int ShippingAddressId { get; set; }
}

public class OrderEntityTypeConfiguration : IEntityTypeConfiguration<Orders>
{
    public void Configure(EntityTypeBuilder<Orders> builder)
    {
        builder.ToTable("Orders");

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId);

        builder.HasOne(x => x.ShippingAddress)
            .WithMany()
            .HasForeignKey(x => x.ShippingAddressId)
            .OnDelete(DeleteBehavior.NoAction);

    }
}


