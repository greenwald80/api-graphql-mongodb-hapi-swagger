RUN:
npm run start

POSTMAN:
GET => http://localhost:3000/api/v1/paintings
POST => http://localhost:3000/api/v1/paintings + Body => form-data
name:Mona Lisa
url:https://en.wikipedia.org/wiki/Mona_Lisa#/media/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg
technique:Portrait

GraphQL:
http://localhost:3000/graphiql
{
  painting(id: "6054cd3f0750382ab0319b3a") {
    name
    technique
    url
  }
}

Swagger Documentation:
http://localhost:3000/documentation

https://nuancesprog.ru/p/1838/