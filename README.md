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
