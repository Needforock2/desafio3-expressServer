export default {
    notRegisted: (payload) => {
        return {
            message: payload, code: 400
        }
    },
    authenticated: {message: "unauthenticated", code: 401},
    notFound: { message: "not found", code: 404 },
    authorized: (payload) => {
        return {
            message: payload, code: 403
        }
    }
    
}