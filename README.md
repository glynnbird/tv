# tv

A TV planner to record series and movies that are coming up on various streaming platforms.

## Data model

All the data is stored in a KV store with range requests on the keyspace to do querying.

### Primary data

- key: `prog:<id>` e.g. `prog:1234`
- value: `{"notes":"Jennifer Aniston romcom"}`
- metadata: `{"t":"Marley & Me","n":"Netflix","d":"2023-06-01","f":"series"}` - n = network, d = date, f = format

### Secondary data

#### By network

- key: `network:netflix:<id>` e.g. `network:netflix:1234`
- value: `null`
- metadata: `{"t":"Marley & Me","n":"Netflix","d":"2023-06-01","f":"series","id":"1234"}`

#### By date

- key: `date:2023-06-01:<id>` e.g. `network:2023-06-01:1234`
- value: `null`
- metadata: `{"t":"Marley & Me","n":"Netflix","d":"2023-06-01","f":"series","id":"1234"}`

## API calls

```sh

# add
ccurl -X POST -H"apikey: $APIKEY" -d'{"t":"The Diplomat","n":"Netflix","d":"2023-03-01","f":"series","notes":"Political drama made by West Wing writers"}' /add
ccurl -X POST -H"apikey: $APIKEY" -d'{"t":"A Quiet Place 2","n":"Netflix","d":"2023-02-01","f":"movie","notes":"Sequel to the original"}' /add

# list
ccurl -X POST -H"apikey: $APIKEY" /list

# query netflix
ccurl -X POST -H"apikey: $APIKEY" -d'{"network":"Netflix"}' /query/network

# query by date
ccurl -X POST -H"apikey: $APIKEY" -d'{"date":"2023-03-01"}' /query/date

# get a single prog
ccurl -X POST -H"apikey: $APIKEY" -d'{"id":"1682499492641"}' /get

# delete a single prog
ccurl -X POST -H"apikey: $APIKEY" -d'{"id":"1682499492641"}' /delete
```