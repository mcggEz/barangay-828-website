# Database Migrations

This folder contains SQL migration files to set up and manage your Supabase database schema.

## Migration Files

1. **001_create_announcements_table.sql** - Creates the announcements table
2. **002_create_gallery_table.sql** - Creates the gallery table

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: [https://app.supabase.com](https://app.supabase.com)
2. Navigate to **SQL Editor** in the left sidebar
3. Open the migration file you want to run
4. Copy and paste the entire SQL content into the SQL Editor
5. Click **Run** to execute the migration
6. Repeat for each migration file in order (001, then 002)

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Using psql (PostgreSQL client)

```bash
# Connect to your Supabase database
psql -h db.your-project-ref.supabase.co -U postgres -d postgres

# Run migration files
\i migrations/001_create_announcements_table.sql
\i migrations/002_create_gallery_table.sql
```

## Migration Order

**Important:** Run migrations in numerical order:
1. First run `001_create_announcements_table.sql`
2. Then run `002_create_gallery_table.sql`

## What Each Migration Does

### 001_create_announcements_table.sql
- Creates the `announcements` table with columns: id, title, description, category, date, created_at, updated_at
- Sets up indexes for better query performance
- Enables Row Level Security (RLS)
- Creates policies for public read access and authenticated write access
- Sets up automatic `updated_at` timestamp updates
- Inserts sample data (optional)

### 002_create_gallery_table.sql
- Creates the `gallery` table with columns: id, title, image, date, category, created_at, updated_at
- Sets up indexes for better query performance
- Enables Row Level Security (RLS)
- Creates policies for public read access and authenticated write access
- Sets up automatic `updated_at` timestamp updates
- Inserts sample data (optional)

## Verifying Migrations

After running the migrations, you can verify they worked by:

1. Going to **Table Editor** in your Supabase dashboard
2. You should see both `announcements` and `gallery` tables
3. Check that the sample data was inserted (if you didn't comment it out)

## Troubleshooting

### Error: "relation already exists"
- The table already exists. You can either:
  - Drop the existing table and re-run the migration
  - Skip the migration if the table structure is correct

### Error: "function already exists"
- The `update_updated_at_column()` function already exists from a previous migration
- This is fine, you can skip that part or modify the migration to use `CREATE OR REPLACE`

### Error: "policy already exists"
- The RLS policy already exists
- You can drop it first or modify the migration to use `CREATE POLICY IF NOT EXISTS` (PostgreSQL 9.5+)

## Adding New Migrations

When creating new migrations:
1. Number them sequentially (003, 004, etc.)
2. Use descriptive names
3. Include comments explaining what the migration does
4. Test in a development environment first
5. Update this README with the new migration details

