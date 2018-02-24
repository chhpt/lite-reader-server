const nodemailer = require('nodemailer');
const pug = require('pug');
const { email } = require('../config');

const compiledFunction = pug.compileFile('../views/index.pug');

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: email.user,
    pass: email.password
  }
});

// 异步发送邮件
const sendEmail = async (to, code) => {
  // 渲染验证码模板
  const verification = compiledFunction({
    code,
    title: 'LiteReader 注册通知'
  });

  // 邮件配置
  const mailOptions = {
    to,
    subject: 'LiteReader 验证码',
    from: email.user,
    html: verification
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (info.accepted.length) {
        resolve({ status: 1 });
      } else {
        resolve({ status: 0 });
      }
      reject(new Error('发送失败'));
    });
  });
};

module.exports = sendEmail;
