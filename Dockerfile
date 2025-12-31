# Use official Postgres image
FROM postgres:15

# Set environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=secret
ENV POSTGRES_DB=tft_stats

# Expose Postgres port
EXPOSE 5432