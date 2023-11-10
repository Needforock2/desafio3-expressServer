export default class MyError{
    static new(message, code) {
        const error = new Error(message)
        error.message = message
        error.statusCode = code || 500
        error.status = `${code}`.startsWith("4") ? "fail" : "error"
        
        throw error
    }
}