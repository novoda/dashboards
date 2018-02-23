module.exports = (htmlRepository) => {
    return {
        tickRate: 8,
        tick: () => {
            console.log('running expired html pruner')
            return htmlRepository.pruneExpired()
        }
    }
}
