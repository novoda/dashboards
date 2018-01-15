module.exports = (htmlRepository) => {
    return {
        tickRate: 8,
        tick: () => {
            return htmlRepository.pruneExpired()
        }
    }
}
