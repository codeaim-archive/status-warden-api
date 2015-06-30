# Status Warden API

The status warden rest api provides backend access to the status warden application stack. It is used by the status warden web client and scheduler to interface with the database.
The scheduler relies on the restify npm package.

### Example Usage

```bash
vagrant up
```

### Current API Endpoints
- Auth
 - Get token                                - Returns an authentication token 

- Job
 - GET job									- Returns a list of all jobs (admin)
 - GET job?monitor=(monitorId)				- Returns a list of jobs for the monitor (admin)
 - GET job/:id								- Returns a job by id (admin)
 - POST job									- Creates a job (admin)
 - PUT job/:id								- Updates a job (admin)
 - DELETE job								- Deletes a job (admin)

- Monitor
 - GET monitor     						    - Returns a list of all monitors (admin)
 - GET monitor?user=(userId)				- Returns a list of monitors for the user (monitor owner or admin)
 - GET monitor/:id							- Returns a monitor by id (monitor owner or admin)
 - POST monitor								- Creates a monitor
 - PUT monitor/:id							- Updates a monitor (monitor owner or admin)
 - DELETE monitor/:id						- Deletes a monitor (monitor owner or admin)

- MonitorEvent
 - GET monitorEvent							- Returns a list of all monitor events (admin)
 - GET monitorEvent?monitor=(monitorId)		- Returns a list of monitor events for the monitor (monitor owner or admin)
 - GET monitorEvent/:id						- Returns a monitor event by id (monitor owner or admin)
 - POST monitorEvent						- Creates a monitor event (admin)

- User
 - GET user 								- Returns a list of all users (admin) 
 - GET user/:id 							- Returns a user by id (user owner or admin)
 - POST user								- Creates a user
 - DELETE user/:id							- Deletes a user by id (user owner or admin)

### Configuration

| Environment Variable       | Default                        | Description                                                                        |
|----------------------------|--------------------------------|------------------------------------------------------------------------------------|
| API_DEBUG_PORT             | 28102                          | The port on which the status-warden-api debugger is listening                      |
| API_DEBUG_WEB_PORT         | 28202                          | The port on which the status-warden-api debugger web interface is listening        |
| API_PORT                   | 28002                          | The port on which the status-warden-api server is listening                        |
| DATABASE_CONNECTION_STRING | '10.0.2.2:28001/status-warden' | The status-warden-database mongodb connection string                               |
| ENVIRONMENT                | 'development'                  | The environment type. Dictates the process manager settings file                   |
| ROOT_ADMIN_DISPLAY_NAME    | 'admin'                        | The display name of the seeded root administrator user account                     |
| ROOT_ADMIN_EMAIL_ADDRESS   | 'admin@codeaim.com'            | The email address of the seeded root administrator user account                    |
| ROOT_ADMIN_PASSWORD        | 'P@ssword'                     | The password of the seeded root administrator user account                         |
| TOKEN_SECRET               | 'tokenSecret'                  | The secret key for encoding and decoding the authentication token                  |

# Status Warden

Status Warden is a status monitoring service for supervising web address health. The warden monitors the status of a web address at a configurable interval and provides serviceable intelligence through email notifications and a web based dashboard.

### Features

* Periodic monitoring of web addresses
* Email notifications on status change
* Configurable monitoring interval
* Basic authentication
* REST style facade API
* Web based dashboard

### Related Links & Documents

- [Status Warden](http://www.statuswarden.com), the software as a service implementation
- The status warden model [npm package](https://www.npmjs.com/package/status-warden-model)
- Other status warden github repositories
 - [status-warden-api](https://github.com/codeaim/status-warden-api) - The status warden rest api
 - [status-warden-database](https://github.com/codeaim/status-warden-database) - The status warden mongodb database
 - [status-warden-model](https://github.com/codeaim/status-warden-model) - The status warden mongoose model
 - [status-warden-scheduler](https://github.com/codeaim/status-warden-scheduler) - The status warden scheduler and background processor
 - [status-warden-web](https://github.com/codeaim/status-warden-web) - The status warden web based dashboard
