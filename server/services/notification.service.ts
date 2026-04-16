export const notificationService = {
  async emit(event: string, payload: Record<string, unknown>) {
    return {
      delivered: false,
      event,
      payload,
    }
  },
}
