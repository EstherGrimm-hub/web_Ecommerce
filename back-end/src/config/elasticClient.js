// require
// const { Client } = require('@elastic/elasticsearch');

// const client = new Client({
//   node: 'https://localhost:9200', // sửa localhost và https
//   auth: {
//     username: 'elastic',           
//     password: 'UG7DN+olYravatx35z*s' 
//   },
//   tls: {
//     rejectUnauthorized: false      
//   }
// });

// module.exports = client;
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'k6_eYyj8vLG67bahqd8='
  },
  tls: {
    rejectUnauthorized: false
  }
})


module.exports = client;

