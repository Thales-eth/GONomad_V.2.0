const rolesChecker = user => {
    return {
        isUser: user?.role === 'USER',
        isAdmin: user?.role === 'ADMIN',
        isPremium: user?.role === 'PREMIUM'
    }
}


module.exports = { rolesChecker }