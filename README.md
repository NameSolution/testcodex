# Hotel Request App

Single Node.js application for hotel service requests and client information.

The interface uses Tailwind CSS with a modern card-based design for a professional look.

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

During development visit `http://localhost:5173/client?room=101` for the client interface and `http://localhost:5173/admin` for the admin dashboard. A public info page is available at `/info`.

Set the `PORT` environment variable to change the server port (defaults to `3001`).

## Deployment

- After `npm run build`, upload the `client/dist` folder with the server to your host.

