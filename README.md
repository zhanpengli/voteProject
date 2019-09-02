# voteProject
投票系统

------

### 1. 环境搭建
        node版本: v10.15.3
        包下载：npm install

### 2. 项目运行
        node src/app.js

### 3.code返回值说明
```javascript
    4000: 'Undefined error information', //未定义的错误信息
    4001: 'Params error', //参数错误
    4002: 'Request type error', //请求执行类型错误
    4003: 'Unsupported data type', //不支持的数据类型
    4004: 'Invalid object id', //无效的对象id
    4005: 'Invalid data format', //无效的数据格式
    4006: 'Invalid request route', //无效的路由请求
    4007: 'The current request without the token', //当前请求没有令牌
    4008: 'Invalid Token', //无效的令牌
    4009: 'Login is invalid, please log in again',//登录失效，请重新登录
    4010: 'The mailbox has been registered',//邮箱已被注册
    4011: 'Username already exists',//用户名已存在
    4012: 'Database operation exception',//数据库操作异常,
    4013: 'Mail sent abnormally',//发送邮件部分出现异常
    4014: 'The mailbox is illegal',//邮箱不合法
    4015: 'Voting has started or ended and can no longer operate',//投票已开始或已结束，不能再进行操作
    4016: 'Voting has not started and cannot be operated',//投票未开始，不能进行操作
    4017: 'Voting is over started and cannot be operated',//投票已结束，不能进行操作
    4018: 'Mailbox is not activated',//邮箱未激活
    4019: "Can't vote again",//不能重复投票
    4020: 'Login failed, wrong email name or password',//登录失败，邮箱或密码错误,
    4021: 'Please re-select, the number of votes is two or more',//请重新选择，票数两人及以上
    4022: 'Please re-select, the number of votes cannot exceed five',// 票数不能少于2或大于5
    4023: 'The number of votes cannot exceed half of the number of candidates',//票数不能超过候选人数一半
    4024: 'Voting is busy, please try again later',//投票繁忙，请稍后重试
```

### 4.接口文档
    项目运行后查看地址：http://127.0.0.1:2019/apiDocs