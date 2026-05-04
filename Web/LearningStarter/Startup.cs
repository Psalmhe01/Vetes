using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using LearningStarter.Data;
using LearningStarter.Entities;
using LearningStarter.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace LearningStarter;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors();
        services.AddControllers();

        services.AddHsts(options =>
        {
            options.MaxAge = TimeSpan.MaxValue;
            options.Preload = true;
            options.IncludeSubDomains = true;
        });

        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        });

        services.AddIdentity<User, Role>(
                options =>
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 8;
                    options.ClaimsIdentity.UserIdClaimType = JwtClaimTypes.Subject;
                    options.ClaimsIdentity.UserNameClaimType = JwtClaimTypes.Name;
                    options.ClaimsIdentity.RoleClaimType = JwtClaimTypes.Role;
                })
            .AddEntityFrameworkStores<DataContext>();

        services.AddMvc();

        services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();

        // Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Learning Starter Server",
                Version = "v1",
                Description = "Description for the API goes here.",
            });

            c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
            c.MapType(typeof(IFormFile), () => new OpenApiSchema { Type = JsonSchemaType.Object, Format = "binary" });
        });

        services.AddSpaStaticFiles(config =>
        {
            config.RootPath = "learning-starter-web/build";
        });

        services.AddHttpContextAccessor();

        // configure DI for application services
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
    {
        dataContext.Database.EnsureDeleted();
        dataContext.Database.EnsureCreated();
        
        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseSpaStaticFiles();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        // global cors policy
        app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        // Enable middleware to serve generated Swagger as a JSON endpoint.
        app.UseSwagger();

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learning Starter Server API V1");
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(x => x.MapControllers());

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "learning-starter-web";
            if (env.IsDevelopment())
            {
                spa.UseProxyToSpaDevelopmentServer("http://localhost:3001");
            }
        });
        
        using var scope = app.ApplicationServices.CreateScope();
        var userManager = scope.ServiceProvider.GetService<UserManager<User>>();
        var roleManager = scope.ServiceProvider.GetService<RoleManager<Role>>();

        SeedRoles(dataContext, roleManager).Wait();
        SeedUsers(dataContext, userManager).Wait();
        SeedCategories(dataContext);
        SeedProducts(dataContext);
        SeedSizes(dataContext);
        SeedMeasurementTypes(dataContext);
        SeedMeasurementCategories(dataContext); 
        SeedProductSizes(dataContext);
        SeedPaymentStatuses(dataContext);

    }

    private static void SeedCategories(DataContext dataContext)
    {
        if (dataContext.Set<Category>().Any())
        {
            return;
        }

        var cate = new List<Category>
        {
            new Category{ Name = "Shirts"},
            new Category{ Name = "Dresses"},
            new Category{ Name = "Skirts"},
            new Category{ Name = "Pants"},
            new Category{ Name = "Blouses"},
            new Category{ Name = "Shorts"}
        };
        
        dataContext.Set<Category>().AddRange(cate);
        dataContext.SaveChanges();
    }
    
    private static void SeedProducts(DataContext dataContext)
    {
        if (dataContext.Set<Product>().Any())
        {
            return;
        }

        var seededProduct1 = new Product
        {
            Name = "Red shirt",
            Description = "This vibrant red crewneck tee is a wardrobe essential, crafted from soft, breathable fabric for all-day comfort. Its classic tailored fit and durable construction make it the perfect versatile staple for layering or wearing on its own.",
            Price = 20,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Shirts").Id,
        };

        var seededProduct2 = new Product
        {
            Name = "Floral Dress",
            Description = "Embrace a cottagecore aesthetic with this floral midi dress, featuring a charming blue-and-white botanical print and whimsical butterfly accents. The sweetheart neckline and puffed sleeves pair with a ruched bodice to create a feminine, timeless silhouette perfect for garden parties or weekend brunches.",
            Price = 50,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Dresses").Id,
        };

        var seededProduct3 = new Product
        {
            Name = "Khaki Pant",
            Description = "These durable khaki work pants offer a classic straight-leg fit designed for both comfort and utility. Featuring reinforced stitching and deep pockets, they provide a clean, professional look that stands up to the demands of the workday.",
            Price = 30,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Pants").Id,
        };

        var seededProduct4 = new Product
        {
            Name = "Silk Blouse",
            Description = "This elegant champagne silk blouse features a sophisticated pointed collar and a hidden button placket for a seamless, polished look. Its unique empire-waist pleating creates a graceful, flowy drape that adds effortless movement and luxury to any outfit.",
            Price = 50,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Blouses").Id
        };

        var seededProduct5 = new Product
        {
            Name = "Sheer Black Blouse",
            Description =
                "This sophisticated mock-neck blouse features a built-in camisole lining and sheer, dramatic lantern sleeves for a layered look in one piece. Finished with smocked cuffs and a relaxed silhouette, it offers an effortless transition from professional settings to evening events.",
            Price = 35,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Blouses").Id
        };

        var seededProduct6 = new Product
        {
            Name = "Pink Lace Pants",
            Description =
                "These romantic lace wide-leg pants feature an intricate floral pattern and a delicate eyelash lace hem for a touch of bohemian luxury. Designed with a comfortable drawstring waistband, they offer a relaxed yet elevated silhouette that transitions beautifully from lounge to special occasions.",
            Price = 40,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Pants").Id,
        };

        var seededProduct7 = new Product
        {
            Name = "Asymmetrical Mini Dress",
            Description =
                "This vibrant floral mini dress features a delicate camisole neckline and a playful, asymmetrical handkerchief hemline. Its whimsical wildflower print and draped silhouette make it an ideal choice for sun-drenched afternoons or casual summer celebrations.",
            Price = 40,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Dresses").Id,
        };

        var seededProduct8 = new Product
        {
            Name = "Green Polo",
            Description =
                "This printed performance polo features an eye-catching, organic maze pattern in vibrant shades of green. Crafted from a moisture-wicking stretch fabric with a classic three-button placket, it’s designed to provide both bold style and breathable comfort on the golf course or at the weekend BBQ.",
            Price = 30,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Shirts").Id,
        };

        var seededProduct9 = new Product
        {
            Name = "Boho Maxi Skirt",
            Description =
                "This tiered maxi skirt features a classic blue-and-white botanical print that radiates effortless bohemian charm. Designed with a comfortable smocked drawstring waist and a flowy, multi-tiered silhouette, it’s the perfect breezy staple for sunny days and seaside strolls.",
            Price = 30,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Skirts").Id,
        };

        var seededProduct10 = new Product
        {
            Name = "Skater Skirt",
            Description =
                "This vibrant red skater skirt features a structured, high-waisted fit and voluminous box pleats for a dramatic flared silhouette. Crafted from a smooth, mid-weight fabric, it’s a bold statement piece that adds a touch of modern retro charm to any look.",
            Price = 25,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Skirts").Id,
        };

        var seededProduct11 = new Product
        {
            Name = "Ruffled Short",
            Description =
                "These lavender pinstripe shorts feature a charming ruffled hem and a comfortable elastic waistband for an easy, breezy fit. Crafted from a lightweight seersucker-style fabric, they are the perfect playful choice for lounging or warm weather outings.",
            Price = 20,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Shorts").Id,
        };

        var seededProduct12 = new Product
        {
            Name = "Navy Short",
            Description = "These navy drawstring shorts are crafted from a lightweight, textured fabric perfect for warm-weather versatility. Featuring a comfortable elastic waistband and a clean, straight-leg fit, they offer an effortless blend of casual comfort and classic style.",
            Price = 25,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Shorts").Id,
        };
        
        dataContext.Set<Product>().Add(seededProduct1);
        dataContext.Set<Product>().Add(seededProduct2);
        dataContext.Set<Product>().Add(seededProduct3);
        dataContext.Set<Product>().Add(seededProduct4);
        dataContext.Set<Product>().Add(seededProduct5);
        dataContext.Set<Product>().Add(seededProduct6);
        dataContext.Set<Product>().Add(seededProduct7);
        dataContext.Set<Product>().Add(seededProduct8);
        dataContext.Set<Product>().Add(seededProduct9);
        dataContext.Set<Product>().Add(seededProduct10);
        dataContext.Set<Product>().Add(seededProduct11);
        dataContext.Set<Product>().Add(seededProduct12);
        dataContext.SaveChanges();
    }

    private static void SeedSizes(DataContext dataContext)
    {
        if (dataContext.Set<Size>().Any())
        {
            return;
        }

        var seededSize1 = new Size
        {
            Name = "Small",
        };
        var seededSize2 = new Size
        {
            Name = "Medium",
        };
        var seededSize3 = new Size
        {
            Name = "Large",
        };
        
        dataContext.Set<Size>().Add(seededSize1);
        dataContext.Set<Size>().Add(seededSize2);
        dataContext.Set<Size>().Add(seededSize3);
        dataContext.SaveChanges();
    }

    public static void SeedMeasurementTypes(DataContext dataContext)
    {
        if (dataContext.Set<MeasurementType>().Any())
        {
            return;
        }

        var types = new List<MeasurementType>
        {
            new MeasurementType{ Name = "Chest/Bust Width", Unit = "inches"},
            new MeasurementType{ Name = "Inseam", Unit = "inches" },
            new MeasurementType{ Name = "Waist Width", Unit = "inches"},
            new MeasurementType{ Name = "Sleeve Length", Unit = "inches"},
            new MeasurementType{ Name = "Shoulder Width", Unit = "inches" },
            new MeasurementType{ Name = "Total Length", Unit = "inches"}
        };

        dataContext.Set<MeasurementType>().AddRange(types);
        dataContext.SaveChanges();
    }

    public static void SeedMeasurementCategories(DataContext dataContext)
    {
        if (dataContext.Set<MeasurementCategory>().Any())
        {
            return;
        }

        var shirtId = dataContext.Set<Category>().First(x => x.Name == "Shirts").Id;
        var dressId = dataContext.Set<Category>().First(x => x.Name == "Dresses").Id;
        var skirtId = dataContext.Set<Category>().First(x => x.Name == "Skirts").Id;
        var pantId = dataContext.Set<Category>().First(x => x.Name == "Pants").Id;
        var blouseId = dataContext.Set<Category>().First(x => x.Name == "Blouses").Id;
        var shortId = dataContext.Set<Category>().First(x => x.Name == "Shorts").Id;
        
        var chestId = dataContext.Set<MeasurementType>().First(x => x.Name == "Chest/Bust Width").Id;
        var inseamId = dataContext.Set<MeasurementType>().First(x => x.Name == "Inseam").Id;
        var waistId = dataContext.Set<MeasurementType>().First(x => x.Name == "Waist Width").Id;
        var sleeveId = dataContext.Set<MeasurementType>().First(x => x.Name == "Sleeve Length").Id;
        var shoulderId = dataContext.Set<MeasurementType>().First(x => x.Name == "Shoulder Width").Id;
        var lengthId = dataContext.Set<MeasurementType>().First(x => x.Name == "Total Length").Id;

        var links = new List<MeasurementCategory>
        {
            new MeasurementCategory { CategoryId = shirtId, MeasurementTypeId = chestId },
            new MeasurementCategory { CategoryId = shirtId, MeasurementTypeId = sleeveId },
            new MeasurementCategory { CategoryId = shirtId, MeasurementTypeId = shoulderId },
            new MeasurementCategory { CategoryId = blouseId, MeasurementTypeId = chestId},
            new MeasurementCategory{ CategoryId = blouseId, MeasurementTypeId = sleeveId},
            new MeasurementCategory{ CategoryId = blouseId, MeasurementTypeId = shoulderId},
            
            new MeasurementCategory{ CategoryId = pantId, MeasurementTypeId = waistId},
            new MeasurementCategory{ CategoryId = pantId, MeasurementTypeId = inseamId},
            new MeasurementCategory{ CategoryId = shortId, MeasurementTypeId = waistId},
            new MeasurementCategory{ CategoryId = shortId, MeasurementTypeId = inseamId},
            
            new MeasurementCategory{ CategoryId = dressId, MeasurementTypeId = chestId},
            new MeasurementCategory{ CategoryId = dressId, MeasurementTypeId = waistId },
            new MeasurementCategory{ CategoryId = dressId, MeasurementTypeId = lengthId },
            
            new MeasurementCategory{ CategoryId = skirtId, MeasurementTypeId = waistId},
            new MeasurementCategory{ CategoryId = skirtId, MeasurementTypeId = lengthId}
        };
        
        dataContext.Set<MeasurementCategory>().AddRange(links);
        dataContext.SaveChanges();
    }

    public static void SeedProductSizes(DataContext dataContext)
    {
        if (dataContext.Set<ProductSize>().Any())
        {
            return;
        }

        var smallId = dataContext.Set<Size>().First(x => x.Name == "Small").Id;
        var mediumId = dataContext.Set<Size>().First(x => x.Name == "Medium").Id;
        var largeId = dataContext.Set<Size>().First(x => x.Name == "Large").Id;
        
        var shirtId = dataContext.Set<Product>().First(x => x.Name == "Red shirt").Id;
        var dressId = dataContext.Set<Product>().First(x => x.Name == "Floral Dress").Id;
        var pantId = dataContext.Set<Product>().First(x => x.Name == "Khaki Pant").Id;
        var blouseId = dataContext.Set<Product>().First(x => x.Name == "Silk Blouse").Id;
        var sheerbId = dataContext.Set<Product>().First(x => x.Name == "Sheer Black Blouse").Id;
        var plpId = dataContext.Set<Product>().First(x => x.Name == "Pink Lace Pants").Id;
        var asymId = dataContext.Set<Product>().First(x => x.Name == "Asymmetrical Mini Dress").Id;
        var poloId = dataContext.Set<Product>().First(x => x.Name == "Green Polo").Id;
        var maxiId = dataContext.Set<Product>().First(x => x.Name == "Boho Maxi Skirt").Id;
        var skaterId = dataContext.Set<Product>().First(x => x.Name == "Skater Skirt").Id;
        var ruffId = dataContext.Set<Product>().First(x => x.Name == "Ruffled Short").Id;
        var navyId = dataContext.Set<Product>().First(x => x.Name == "Navy Short").Id;


        var productSizesToAdd = new List<ProductSize>
        {
            new ProductSize {ProductId = shirtId, SizeId = smallId, Stock = 10 },
            new ProductSize{ProductId = shirtId, SizeId = mediumId, Stock = 15 },
            new ProductSize{ProductId = shirtId, SizeId = largeId, Stock = 5},
            
            new ProductSize{ProductId = dressId, SizeId = smallId, Stock = 2},
            new ProductSize {ProductId = dressId, SizeId = mediumId, Stock = 8},
            new ProductSize {ProductId = dressId, SizeId = largeId, Stock = 12},
            
            new ProductSize{ProductId = pantId, SizeId = smallId, Stock = 5},
            new ProductSize{ProductId = pantId, SizeId = mediumId, Stock = 10},
            new ProductSize{ProductId = pantId, SizeId = largeId, Stock = 8},
            
            new ProductSize{ProductId = blouseId, SizeId = smallId, Stock = 10},
            new ProductSize{ProductId = blouseId, SizeId = mediumId, Stock = 8},
            new ProductSize{ProductId = blouseId, SizeId = largeId, Stock = 15},
            
            new ProductSize{ProductId = sheerbId, SizeId = smallId, Stock = 15},
            new ProductSize{ProductId = sheerbId, SizeId = mediumId, Stock = 20},
            new ProductSize{ProductId = sheerbId, SizeId = largeId, Stock = 8},
            
            new ProductSize{ProductId = plpId, SizeId = smallId, Stock = 6},
            new ProductSize{ProductId = plpId, SizeId = mediumId, Stock = 12},
            new ProductSize{ProductId = plpId, SizeId = largeId, Stock = 20},
            
            new ProductSize{ProductId = asymId, SizeId = smallId, Stock = 20},
            new ProductSize{ProductId = asymId, SizeId = mediumId, Stock = 8},
            new ProductSize{ProductId = asymId, SizeId = largeId, Stock = 11},
            
            new ProductSize{ProductId = poloId, SizeId = smallId, Stock = 18},
            new ProductSize{ProductId = poloId, SizeId = mediumId, Stock = 20},
            new ProductSize{ProductId = poloId, SizeId = largeId, Stock = 25},
            
            new ProductSize{ProductId = maxiId, SizeId = smallId, Stock = 5},
            new ProductSize{ProductId = maxiId, SizeId = mediumId, Stock = 12},
            new ProductSize{ProductId = maxiId, SizeId = largeId, Stock = 8},
            
            new ProductSize{ProductId = skaterId, SizeId = smallId, Stock = 20},
            new ProductSize{ProductId = skaterId, SizeId = mediumId, Stock = 8},
            new ProductSize{ProductId = skaterId, SizeId = largeId, Stock = 12},
            
            new ProductSize{ProductId = ruffId, SizeId = smallId, Stock = 18},
            new ProductSize{ProductId = ruffId, SizeId = mediumId, Stock = 10},
            new ProductSize{ProductId = ruffId, SizeId = largeId, Stock = 9},
            
            new ProductSize{ProductId = navyId, SizeId = smallId, Stock = 10},
            new ProductSize{ProductId = navyId, SizeId = mediumId, Stock = 18},
            new ProductSize{ProductId = navyId, SizeId = largeId, Stock = 20}

        };

        dataContext.Set<ProductSize>().AddRange(productSizesToAdd);
        dataContext.SaveChanges();
    }
    private static void SeedPaymentStatuses(DataContext dataContext)
    {
        if (dataContext.Set<PaymentStatus>().Any())
        { 
            return;
        }
    
        var statuses = new List<PaymentStatus>
        {
            new PaymentStatus { Status = "Pending" },
            new PaymentStatus { Status = "Paid" },
            new PaymentStatus { Status = "Failed" },
            new PaymentStatus { Status = "Refunded" }
        };
    
        dataContext.Set<PaymentStatus>().AddRange(statuses);
        dataContext.SaveChanges();
    }

    private static async Task SeedUsers(DataContext dataContext, UserManager<User> userManager)
    {
        var numUsers = dataContext.Users.Count();

        if (numUsers == 0)
        {
            var seededUser = new User
            {
                FirstName = "Seeded",
                LastName = "User",
                UserName = "admin",
                Email = "suser@abc.com",
                Phone = "12345",
            };

            await userManager.CreateAsync(seededUser, "Password");
            await userManager.AddToRoleAsync(seededUser, "Admin");
            await dataContext.SaveChangesAsync();
        }
    }
    
    private static async Task SeedRoles(DataContext dataContext, RoleManager<Role> roleManager)
    {
        var numRoles = dataContext.Roles.Count();

        if (numRoles == 0)
        {
            var seededRole = new Role
            {
                Name = "Admin"
            };

            await roleManager.CreateAsync(seededRole);
            await dataContext.SaveChangesAsync();
        }
    }
}
