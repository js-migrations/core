# Delete Column

To avoid downtime caused by deleting a column in migrations it's recommended that you make three releases as explained below.

1. Release 1
    - Migration: Make column optional.
    - Code change: Stop reading from column.
2. Release 2
    - Code change: Stop writing to column.
3. Release 3
    - Migration: Delete the column.
