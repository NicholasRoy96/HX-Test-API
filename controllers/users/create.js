const validator = require('email-validator')

module.exports = async (req, res) => {
  try {
    const db = req.app.get('db')
    const { email, givenName, familyName } = req.body

    // existence checking required params
    if (!email || !givenName || !familyName) {
      return res.status('400').send('You must provide an email, given name, and family name.')
    }

    // email checks & inserting user
    if (!validator.validate(email)) {
      return res.status('400').send('You must provide a valid email')
    }
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
    if (!existingUser) {
      const newUser = {
        email: email.toLowerCase(),
        givenName,
        familyName,
        created: new Date().toString()
      }
      await db.collection('users').insertOne(newUser)
      return res.status('201').send('User created')
      // TODO also return id of document just created so can test get route, update route and delete route?
    }
    if (existingUser) {
      return res.status('409').send('A user already exists with this email.')
    }
  } catch (err) {
    return res.status('500').send(err)
  }
}
