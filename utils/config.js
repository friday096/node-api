var config = {

    //Local DB Credetinals
    // db: {
    //   host: 'localhost',
    //   user: 'root',
    //   password: '',
    //   database: 'vetrine',
    // },
    //Live DB Creditionals
    // db: {
    //     host: 'localhost',
    //     user: 'vetrine',
    //     password: 'Vetrine2023@',
    //     database: 'vetrine',
    //   },
    // smtp_data:{
    //     host: "smtp.example.com",
    //     port: 587,
    //     secure: false, // upgrade later with STARTTLS
    //     service: 'gmail',
    //     auth: {
    //       user: "username",
    //       pass: "password",
    //     },
    // },
  
    smtp_data: {
      service: 'gmail',
      port: 465,
      auth: {
        user: 'ssantoshh1996@gmail.com',
        pass: 'gkzpgelcazzvpnej',
      },
      tls: {
        rejectUnauthorized: false
      }
    },
    from_email: 'ssantoshh1996@gmail.com',
  
  };
  
  
  module.exports = config;