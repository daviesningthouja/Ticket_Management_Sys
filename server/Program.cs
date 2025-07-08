using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using server.Data;
using System.Text;
using AutoMapper;
using server.Profiles;
using server.Models;


var builder = WebApplication.CreateBuilder(args);

// AutoMapper registration ✅
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<MappingProfile>();
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TmsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DevConnection")));
builder.Services.AddHttpContextAccessor();
//builder.Services.AddScoped<>;




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
