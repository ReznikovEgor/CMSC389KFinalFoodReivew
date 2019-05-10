function addReviewAvg(a, b, c){
    return ((b*(c-1)) + a)/c
}

function removeReviewAvg(a,b,c){
    return (b-a)/c
}

module.exports = {
    addReviewAvg: addReviewAvg,
    removeReviewAvg: removeReviewAvg
};