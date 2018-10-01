# Rename Column

To avoid downtime caused by renaming columns in migrations it's recommended that you make three releases as explained below.

1. Release 1
    - Migration: Create a new column with the new name and make it optional.
    - Migration: Make the old column optional (if not already).
    - Code change: Stop reading from old column.
    - Code change: Start writing to new column.
2. Release 2
    - Migration: Copy values from old column to new column.
    - Migration: Make the new column required (if necessary).
    - Code change: Stop writing to old column.
    - Code change: Start reading from new column.
3. Release 3
    - Migration: Delete the old column.
