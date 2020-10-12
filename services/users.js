const { v4: uuidv4 } = require('uuid');

let users = [
    {
        id : 1,
        username : 'test',
        name : 'Testi Teppo',
        email : 'teppo@mail.com',
        password: '$2y$06$eQav1OaIyWSUnlvPSaFXRe5gWRqXd.s9vac1SV1GafxAr8hdmsgCy', //johndoepassword
        address : {
            street : 'Testitie 1',
            country : 'Finland',
            postalCode : '11111',
            city : 'Helsinki'
        },
        validApiKey: null
    },
    {
        userid : 2,
        username : "teppo1",
        name : "Testi Teppo",
        email : "teppo.testi@mail.com",
        password: '$2y$06$PhZ74dT8/5g6B8SgssFq6ey4ojLxmP6pos2DcevMUGw25Vc9jGEou', //testerpassword
        address : {
            street : "kaduntie 1",
            country : "Finland",
            postalCode : "012234",
            city : "Kaupunkila"
        },
        validApiKey: null
    }
]

module.exports = {
  getUserById: (id) => users.find(u => u.id == id),
  getUserByName: (username) => users.find(u => u.username == username),
  resetApiKey: (userId) => {
    const user = users.find(u => u.id == userId);
    if(user === undefined)
    {
      return false
    }

    user.validApiKey = uuidv4();
    return user.validApiKey;
  },
  getApiKey: (userId) => {
    const user = users.find(u => u.id == userId);
    if(user === undefined)
    {
      return false
    }

    return user.validApiKey;
  },
  getUserWithApiKey: (apiKey) => users.find(u => u.validApiKey == apiKey),
  addUser: (username, name, email, password, address) => {
    users.push({
      id: uuidv4(),
      username,
      name,
      email,
      password,
      address
    });
  }

}