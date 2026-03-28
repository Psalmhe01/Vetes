using System;
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

        var seededCategory1 = new Category
        {
            Name = "Shirts",
        };
        
        dataContext.Set<Category>().Add(seededCategory1);
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
            CategoryId = dataContext.Set<Category>().First().Id,
        };
        
        dataContext.Set<Product>().Add(seededProduct1);
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
        
        dataContext.Set<Size>().Add(seededSize1);
        dataContext.SaveChanges();
    }

    public static void SeedMeasurementTypes(DataContext dataContext)
    {
        if (dataContext.Set<MeasurementType>().Any())
        {
            return;
        }

        var seededMeasurementType = new MeasurementType
        {
            Name = "Chest Width",
            Unit = "inches",
        };
        
        dataContext.Set<MeasurementType>().Add(seededMeasurementType);
        dataContext.SaveChanges();
    }

    public static void SeedMeasurementCategories(DataContext dataContext)
    {
        if (dataContext.Set<MeasurementCategory>().Any())
        {
            return;
        }

        var seededMeasurementCategory = new MeasurementCategory
        {
            CategoryId = dataContext.Set<Category>().First().Id,
            MeasurementTypeId = dataContext.Set<MeasurementType>().First().Id,
        };
        
        dataContext.Set<MeasurementCategory>().Add(seededMeasurementCategory);
        dataContext.SaveChanges();
    }

    public static void SeedProductSizes(DataContext dataContext)
    {
        if (dataContext.Set<ProductSize>().Any())
        {
            return;
        }

        var seededProductSize = new ProductSize
        {
            Stock = 3,
            SizeId = dataContext.Set<Size>().First().Id,
            ProductId = dataContext.Set<Product>().First().Id,
        };
            
            dataContext.Set<ProductSize>().Add(seededProductSize);
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
