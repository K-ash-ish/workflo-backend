### Project deployed on Render

Deployed API endpoint

```
https://crework-assignment-backend.onrender.com/api/user/login
```

The API endpoints are:

- /api/user/signup
  POST {name, email, password}
- /api/user/login
  POST { email, password}
- /api/user/logout
  POST

#### Protected Routes

Endpoints to create/edit/update/delete tasks:

- /api/task/create
  POST{title,status,?description,?deadline,?priority}
- /api/task/getAllTasks
  GET
- /api/task/delete
  POST{id}
- /api/task/update
  POST {id ,...valuesToUpdate}

- Using jwt for user authorization
- User will only be able to handle tasks if logged in

Frontend Repo:
[Github](https://github.com/K-ash-ish/crework-assignment)
