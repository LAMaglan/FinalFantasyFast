Run with poetry:

```
poetry shell
cd app
uvicorn main:app --reload
```

Retrieves data from external Final fantasy api
https://www.moogleapi.com/

With default settings, you can test out the API through swagger docs:
http://127.0.0.1:8000/docs/

The `characters` and `monsters` routers fetches data from the above link,
and stores them in a sqlite3 database (sql_.db).


Frontend runs on React.js , using axios to make HTTP requests to the FastAPI backend.
To run the frontend (while the backend is running), do:
```bash
cd react-frontend
npm start
```