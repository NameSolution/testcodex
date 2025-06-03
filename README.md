# Hotel Request App

Single Node.js application for hotel service requests and client information.

The admin dashboard layout is based on the **TailAdmin** free React Tailwind template. The interface uses Tailwind CSS with a card-based design for a professional look.

## Installation

```
npm install
```

## Development

Start development:
```
npm run dev
```

To serve the built app:
```
npm run build
npm start
```

During development visit `http://localhost:5173/client/101` for the client interface and `http://localhost:5173/admin` for the admin dashboard. The admin area lets you manage service requests, create rooms with QR codes and requires a password.
Set the `ADMIN_PASS` environment variable to define this password (default: `admin`).
The `/client/:room` path displays the interface for a specific room. A public info page is available at `/info`.

Set the `PORT` environment variable to change the server port (defaults to `3001`).

## Deployment

- After `npm run build`, upload the `client/dist` folder with the server to your host.

