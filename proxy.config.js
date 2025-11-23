const proxy = [
    {
        context: ['/'],
        target: 'http://localhost:8081',
        secure: false,
        changeOrigin: true
    }
];

module.exports = proxy;
