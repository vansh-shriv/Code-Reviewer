import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import lodash from 'lodash'

function BadFunctionName() {
    const x = 1
    const y = 2
    return x + y
}

function calculateUserStatistics(userData) {
    // This is a very long function that should trigger the long function warning
    // because it has more than 30 lines of code in total.
    let result = 0
    
    for (let i = 0; i < 100; i++) {
        if (i % 2 === 0) {
            result += i
        } else {
            result -= i
        }
    }
    
    // More code to make it longer
    for (let j = 0; j < 50; j++) {
        result *= 2
        if (result > 1000) {
            result = Math.floor(result / 2)
        }
    }
    
    // Even more code
    for (let k = 0; k < 25; k++) {
        result += k * 2
        if (result < 0) {
            result = Math.abs(result)
        }
    }
    
    return result
}

const Component = () => {
    const [data, setData] = useState(null)
    const a = 10
    const b = 20
    
    useEffect(() => {
        // This will use axios but not lodash
        axios.get('/api/data')
            .then(response => setData(response.data))
            .catch(error => console.error(error))
    }, [])
    
    return (
        <div>
            <h1>Hello World</h1>
            <p>Data: {data}</p>
        </div>
    )
}

// Unused variable
const unusedVar = "This will not be used anywhere"

export default Component 