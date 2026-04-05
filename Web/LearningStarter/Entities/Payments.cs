using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Payment {
  public int Id { get; set; }
  
  public int OrderId { get; set; }
  public virtual Orders Order { get; set; }
  
  public int PaymentMethodId { get; set; }
  public virtual PaymentMethod PaymentMethod { get; set; }
  
  public int PaymentStatusId { get; set; }
  public virtual PaymentStatus PaymentStatus { get; set; }

  public decimal Amount { get; set; }
  public DateTimeOffset PaidAt { get; set; }
}

public class PaymentGetDto {
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int PaymentMethodId { get; set; }
    public int PaymentStatusId { get; set; }
    public decimal Amount { get; set; }
    public DateTimeOffset PaidAt { get; set; }
}

public class PaymentCreateDto {
  public int OrderId { get; set; }
  public int PaymentMethodId { get; set; }
  public int PaymentStatusId { get; set; }
  public decimal Amount { get; set; }
  public DateTimeOffset PaidAt { get; set; }
}

public class PaymentMethod {
  public int Id { get; set; }
  public int UserId { get; set; }
  public string Type { get; set; }
  public string Provider { get; set; }
  public string Last4 { get; set; }
  public int ExpMonth { get; set; }
  public int ExpYear { get; set; }
  public string Token { get; set; }
  public DateTimeOffset CreatedAt { get; set; }
}
public class PaymentStatus {
  public int Id { get; set; }
  public string Status { get; set; }
}

public class PaymentEntityConfiguration : IEntityTypeConfiguration<Payment> {
  public void Configure(EntityTypeBuilder<Payment> builder) {
    builder.ToTable("Payments");

    builder.HasKey(p => p.Id);

    builder.Property(p => p.Amount)
      .HasColumnType("decimal(10,2)")
      .IsRequired();

    builder.Property(p => p.PaidAt)
      .IsRequired();

    builder.HasOne(p => p.Order)
      .WithMany(o => o.Payments)
      .HasForeignKey(p => p.OrderId);

    builder.HasOne(p => p.PaymentMethod)
      .WithMany()
      .HasForeignKey(p => p.PaymentMethodId);

    builder.HasOne(p => p.PaymentStatus)
      .WithMany()
      .HasForeignKey(p => p.PaymentStatusId);  
  }
}
