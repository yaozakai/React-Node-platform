const { sql } = require('@vercel/postgres');
const crypto = require('crypto');

class UserModel {
  constructor(id, name, email, password, created, lastSession, loginCount, isVerified, emailToken, forgotToken, image, googleToken, facebookToken) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.created = created;
    this.lastSession = lastSession;
    this.loginCount = loginCount;
    this.isVerified = isVerified;
    this.emailToken = emailToken;
    this.forgotToken = forgotToken;
    this.image = image;
    this.googleToken = googleToken;
    this.facebookToken = facebookToken;
  }

  static async saveOrUpdate(user) {
    try {
      const result = await sql`
        INSERT INTO users (id, name, email, password, created, lastsession, logincount, isverified, username, emailtoken, forgottoken, image, googletoken, facebooktoken)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password}, ${user.created}, ${user.lastSession}, ${user.loginCount}, ${user.isVerified}, ${user.username}, ${user.emailToken}, ${user.forgotToken}, ${user.image}, ${user.googleToken}, ${user.facebookToken})
        ON CONFLICT (id) DO UPDATE SET
        name = ${user.name},
        email = ${user.email},
        password = ${user.password},
        created = ${user.created},
        lastsession = ${user.lastSession},
        logincount = ${user.loginCount},
        isverified = ${user.isVerified},
        emailtoken = ${user.emailToken},
        forgottoken = ${user.forgotToken},
        image = ${user.image},
        googletoken = ${user.googleToken},
        facebooktoken = ${user.facebookToken}
        RETURNING *;
      `;
      return result.rows[0];
    } catch (error) {
      console.error('Error saving or updating user:', error);
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      const result = await sql`
          SELECT * FROM users
          WHERE email = ${email};`;
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  static async getUserByUsername(username) {
    try {
      const result = await sql`
          SELECT * FROM users WHERE username = ${username};`;
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  }

  static async createUser(email, username, hashedPassword) {
    try {
      const emailToken = crypto.randomBytes(64).toString('hex');
      const result = await sql`
          INSERT INTO users (created, email, name, emailtoken, password)
          VALUES (NOW(), ${email}, ${username}, ${emailToken}, ${hashedPassword})
          RETURNING *;`;
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserByEmailToken(emailToken) {
    try {
      const result = await sql`
          SELECT * FROM users WHERE emailtoken = ${emailToken};`;
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by email token:', error);
      return null;
    }
  }

  static async getUserByForgotToken(forgotToken) {
    try {
      const result = await sql`
          SELECT * FROM users WHERE forgottoken = ${forgotToken};`;
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by forgot token:', error);
      return null;
    }
  }

  static async getUserByFacebookToken(facebookToken) {
    try {
      const result = await sql`
          SELECT * FROM users WHERE facebooktoken = ${facebookToken};
      `;
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by Facebook token:', error);
      return null;
    }
  }

  static async getUserByGoogleToken(googleToken) {
    try {
      const result = await sql`
          SELECT * FROM users WHERE googletoken = ${googleToken};
      `;
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching user by Google token:', error);
      return null;
    }
  }
}

module.exports = UserModel;
