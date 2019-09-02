const config = require('../config').config;
const nodemailer = require('nodemailer');
const logger = require('./logger');

const options = {
    service:'qq',
    auth:{
        user:config.qq.user,
        pass:config.qq.qqSmtpCode
    }
}

class Email{
    constructor(){
        this.transporter = null;
        this.flag = false;//判断是否已经初始化
    }

    /**
     * 初始化
     */
    async init(){
        this.flag = true;
        try{
            this.transporter = nodemailer.createTransport(options)
        }
        catch(error){
            logger.error('sendMail error: ', error.message);
        }
    }

    /**
     * 发送邮件
     * @param {*} toEmail
     */
    async sendEmail(toEmail){
        let mailOptions = {
            from: config.qq.user,
            to: toEmail,
            subject: '邮箱验证',
            html: `<h2>邮箱有效性验证</h2><h3>
            <a href="http://${config.app.url}:${config.app.port}/user/activateEmail?email=${toEmail}">  
            请点击此处进行账号激活</a></h3>`
        }

        if (!this.transporter && !this.flag) {
            this.init()
        }

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        }
        catch (error) {
            logger.error('sendEmail error: ', error.message);
            return false;
        }
        
    }

    /**
     * 邮箱合法性验证
     * @param {*} email 
     */
    async emailCheck(email){
        let rex = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
        if (rex.test(email)) {
            return true;
        }
        else {
            return false;
        }
    }

}

module.exports = new Email();