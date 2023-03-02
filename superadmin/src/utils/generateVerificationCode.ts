import crypto from 'crypto'

const generateCode = (n: number): string => {
    let number = ''

    for(let i=0; i<n; i++) {
       number += crypto.randomInt(0, 9)
    }

    return number
}

export default generateCode