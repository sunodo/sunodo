#!/usr/bin/env sh

/command/s6-echo "Defining postgres user's default password ..."

until su postgres -c "pg_isready";
do
    /command/s6-echo "Waiting for postgres to be ready ..."
    sleep .1
done

su postgres \
        -s /bin/sh \
        -c "psql -c \"ALTER USER postgres PASSWORD 'postgres';\""

