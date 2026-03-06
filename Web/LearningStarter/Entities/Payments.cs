using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Payment {
  public int Id { get; set; }
  
  public int OrderId { get; set; }
  public Order Order { get; set: }
  
  public int PaymentMethodId { get; set; }
  public PaymentMethod PaymentMethod { get; set: }
  
  public int PaymentStatusId { get; set; }
  public decimal Amount { get; set; }
  public DateTimeOffset PaidAt { get; set; }
}
public class Order {
  public int Id { get; set: }
  public int UserId { get; set: }
  public string Status { get; set: }
  public DateTimeOffset CreatedAt { get; set: }
  public int ShippingAddress { get; set; }

  public List<Payment> Payments { get; set: }
}
public class PaymentMethod {
  public int Id {get; set;}
}
