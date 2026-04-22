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
            Description = "It is a shirt that is red",
            Price = 20,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Shirts").Id,
        };

        var seededProduct2 = new Product
        {
            Name = "Floral Dress",
            Description = "A mid length dress with flowers on it",
            Price = 50,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Dresses").Id,
        };

        var seededProduct3 = new Product
        {
            Name = "Khaki Pant",
            Description = "Classic, straight cut khaki pants",
            Price = 30,
            CategoryId = dataContext.Set<Category>().First(x => x.Name == "Pants").Id,
        };
        
        dataContext.Set<Product>().Add(seededProduct1);
        dataContext.Set<Product>().Add(seededProduct2);
        dataContext.Set<Product>().Add(seededProduct3);
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

        var productSizesToAdd = new List<ProductSize>
        {
            new ProductSize { ProductId = shirtId, SizeId = smallId, Stock = 10 },
            new ProductSize{ ProductId = shirtId, SizeId = mediumId, Stock = 15 },
            new ProductSize{ ProductId = shirtId, SizeId = largeId, Stock = 5},
            
            new ProductSize{ ProductId = dressId, SizeId = smallId, Stock = 2},
            new ProductSize { ProductId = dressId, SizeId = mediumId, Stock = 8},
            new ProductSize { ProductId = dressId, SizeId = largeId, Stock = 12},
            
            new ProductSize{ ProductId = pantId, SizeId = smallId, Stock = 5},
            new ProductSize{ProductId = pantId, SizeId = mediumId, Stock = 10},
            new ProductSize{ProductId = pantId, SizeId = largeId, Stock = 8}
        };

        dataContext.Set<ProductSize>().AddRange(productSizesToAdd);
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
