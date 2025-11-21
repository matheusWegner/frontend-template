const proxy = [
    {
        context: ['/api'],
        target: 'https://fbf2vdjpf3.us-east-1.awsapprunner.com',
        secure: false,
        changeOrigin: true
    }
];

module.exports = proxy;
