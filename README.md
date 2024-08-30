Note: a fair amount of help from ChatGPT throughout

The microservice can be run with or without docker-compose

![Screenshot from 2024-08-27 15-10-32](https://github.com/user-attachments/assets/0dabf685-d3a4-4bd7-9ab8-53d50229e640)

![Screenshot from 2024-08-27 15-11-00](https://github.com/user-attachments/assets/2c97a793-e096-4d9a-9d3e-69697107b954)


# Run with docker-compose

```bash
docker-compose up
```

Note: if you for whatever reason make changes to the dockerfiles or docker-compose.yml files, the
rebuild with

```bash
docker-compose up --build
```

Note: nginx is somewhat superflous, unless this is deployed on a remote server, with many users,
and/or larger data

# Run without docker-compose

The backend (FastAPI) runs with poetry:

```bash
cd backend
poetry shell
python intialize_db.py
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
and stores them in a postgres database.
Note: the use of (postgres) database is somewhat superflous, there are no POST endpoints in the backend API.

The frontend is accessible through
http://localhost:3000
