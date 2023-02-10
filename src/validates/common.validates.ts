export function verifyDateRequest(dateRequest: string): string | null {
    const dateResult = new Date(dateRequest)
    if (`${dateResult}` !== 'Invalid Date') {
        return dateResult.toLocaleDateString("pt-BR");
    }
    return null
}