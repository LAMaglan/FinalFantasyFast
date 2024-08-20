The microservice can be run with or without docker-compose


# Run with docker-compose

```bash
docker-compose up
```

Note: if you for whatever reason make changes to the dockerfiles or docker-compose.yml files, the
rebuild with

```
docker-compose up --build
```

# Run without docker-compose

The backend (FastAPI) runs with poetry:

```
poetry shell
cd app
uvicorn main:app --reload
```

Frontend runs on React.js , using axios to make HTTP requests to the FastAPI backend.
To run the frontend (while the backend is running), do:
```bash
cd react-frontend
npm start
```


# Details on the running services

The backend retrieves data from external Final fantasy api
https://www.moogleapi.com/

With default settings, you can test out the API through swagger docs:
http://127.0.0.1:8000/docs/
or
http://0.0.0.0:8000/docs/
if using the docker-compose approach. 

The `characters` and `monsters` routers fetches data from the above link,
and stores them in a sqlite3 database (sql_app.db).

The frontend is accessible through
http://localhost:3000


The frontend is accessible through