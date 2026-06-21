function getRandomVariable(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function dosomeHeavyTask(){
    const ms = getRandomVariable([100, 150, 200, 300, 500, 600, 1000, 1400, 2500]);
    const shouldThrowError = getRandomVariable([1, 2, 3, 4, 5, 6, 7, 8]) === 8; 
    if (shouldThrowError) {
        const randomError = getRandomVariable([
            "DB Payment Failure",
            "DB Server is down",
            "Access Denied",
            "Not Found Error",
        ]);
        throw new Error(randomError);
    }
    return new Promise((resolve, reject) => setTimeout(() => resolve(ms), ms));
}

module.exports = { dosomeHeavyTask };