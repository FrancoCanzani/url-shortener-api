# URL Shortener API

## Description

This is a URL Shortener API that allows you to shorten URLs, manage links, and generate QR codes. It is built using Node.js and Express.

## Disclaimer

**Not all routes are open to the public.** Some endpoints require an API key for authorization. Unauthorized access to these endpoints is strictly prohibited.

## Getting Started

### Prerequisites

- Node.js

- MongoDB

### Installation

1. Clone the repository:

```bash
Copy  code
git  clone  https://github.com/FrancoCanzani/url-shortener-server.git

```

2. Navigate to the project directory:

```bash
Copy  code
cd  url-shortener-server
```

3. Install dependencies:

```bash
Copy  code
npm  install
```

4. Create a .env file in the root directory and add your environment variables:

```env

API_KEY=your_api_key
MONGODB_URI=your_mongodb_uri
```

5. Running the Application

```bash
Copy  code
npm  start
```

## Endpoints

### Shorten URL

- POST /api/v1/links 🔒

  - Description: Shorten a new URL.

  - Headers:

    - Content-Type: application/json

    - authorization: API_KEY

  - Body:

    ```json
    {
      "url": "your_long_url",
      "slug": "optional_slug"
    }
    ```

## Get Recent Links

- GET /api/v1/links/recent 🔒

  - Description: Retrieve the most recent shortened URLs.

## Redirect to Original URL

- GET /api/v1/:id

  - Description: Redirect to the original URL associated with the given ID.

## Generate QR Code

- GET /api/v1/qr/:url

  - Description: Generate a QR code for the given URL.

# License

This project is licensed under the MIT License.
