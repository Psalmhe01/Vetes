using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class ShippingAddresses
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    
    public virtual User User { get; set; }
}

public class ShippingAddressesGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
}

public class ShippingAddressesCreateDto
{
    public int UserId { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
}

public class ShippingAddressesUpdateDto
{
    public int UserId { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
}

public class ShippingAddressEntityTypeConfiguration : IEntityTypeConfiguration<ShippingAddresses>
{
    public void Configure(EntityTypeBuilder<ShippingAddresses> builder)
    {
        builder.ToTable("ShippingAddresses");

        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId);
    }
}