# Link

Link is an API to make link redirection. You can bound a link to an other and every client who use this link is redirected to the other.

## Usage

With the API you can create a link, get your links, get your views on each link you have, update the bounded link for a link and delete a link.

To use this API you have to choose your token. It must be strong and keep it safe.

I let you try this API to see the responses.

### Create a link

```javascript
fetch("https://api.adn2.ovh/create", {
    method: "POST",
    body: JSON.stringify({
        // your data
        token: "your_token", // optional
        link: "your/link", // optional
        redirect: "https://example.com/redirection"
    }),
});
```

### Get your links

```javascript
fetch("https://api.adn2.ovh/getLink", {
    method: "POST",
    body: JSON.stringify({
        // your data
        token: "your_token",
    }),
});
```

### Get your views for a link

```javascript
fetch("https://api.adn2.ovh/getView", {
    method: "POST",
    body: JSON.stringify({
        // your data
        token: "your_token",
        link: "your/link",
    }),
});
```

### Update the bounded link for a link

```javascript
fetch("https://api.adn2.ovh/update", {
    method: "POST",
    body: JSON.stringify({
        // your data
        token: "your_token",
        link: "your/link",
        redirect: "https://example.com/new/redirection"
    }),
});
```

### Delete a link

```javascript
fetch("https://api.adn2.ovh/delete", {
    method: "POST",
    body: JSON.stringify({
        // your data
        token: "your_token",
        link: "the/link/to/delete",
    }),
});
```