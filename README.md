# audioverse-gatsby

## Testing

```bash
npm install
brew install watchman
npm test
```

## Docker

```
chmod +x in.sh && ./in.sh npm install
docker-compose up
open http://localhost:8001
open http://localhost:8001/__graphql
```

### Commands

Command                                                        | Notes
---------------------------------------------------------------|--------------------------------------------------------
`docker exec -it audioverse-public-website_gatsby_1 /bin/bash` | Jump into container
`docker-compose run --rm gatsby echo hello`                    | Run commands in temporary instance
`./in.sh echo hello`                                           | Use helper script to run commands in temp instance