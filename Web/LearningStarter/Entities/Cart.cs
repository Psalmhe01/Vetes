using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;


public class Cart
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    
    public List<CartProduct> Products { get; set; }
}

public class CartGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public List<CartProductGetDto> Products { get; set; }
}

public class CartCreateDto
{
    public int UserId { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class CartUpdateDto
{
    public int UserId { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class CartEntityTypeConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.ToTable("Cart");
    }
}