using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public partial class TmsContext : DbContext
{
    public TmsContext()
    {
    }

    public TmsContext(DbContextOptions<TmsContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<Seat> Seats { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<TicketCategory> TicketCategories { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=DAVIESLEGION-5;Database=TMS;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cart__3214EC07908429BD");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__CartItem__3214EC070438C2CB");

            entity.HasOne(d => d.Cart).WithMany(p => p.CartItems)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CartItem__CartId__2645B050");

            entity.HasOne(d => d.Seat).WithMany(p => p.CartItems)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CartItem__SeatId__2739D489");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Events__3214EC0793F2E805");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status).HasDefaultValue("Pending");

            entity.HasOne(d => d.Organizer).WithMany(p => p.Events)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Events__Organize__2C3393D0");
        });

        modelBuilder.Entity<Seat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Seat__3214EC07483789DE");

            entity.Property(e => e.IsBooked).HasDefaultValue(false);

            entity.HasOne(d => d.Category).WithMany(p => p.Seats)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seat__CategoryId__1EA48E88");
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tickets__3214EC075E978C4F");

            entity.Property(e => e.BookingTime).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status).HasDefaultValue("Valid");

            entity.HasOne(d => d.Category).WithMany(p => p.Tickets).HasConstraintName("FK__Tickets__Categor__2BFE89A6");

            entity.HasOne(d => d.Event).WithMany(p => p.Tickets)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tickets_Events");

            entity.HasOne(d => d.Seat).WithMany(p => p.Tickets).HasConstraintName("FK__Tickets__SeatId__2B0A656D");

            entity.HasOne(d => d.User).WithMany(p => p.Tickets)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Tickets_Users");
        });

        modelBuilder.Entity<TicketCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TicketCa__3214EC07DCB8919B");

            entity.HasOne(d => d.Event).WithMany(p => p.TicketCategories)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TicketCat__Event__160F4887");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC07A28506EA");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
