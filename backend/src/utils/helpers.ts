export const generateTimeSlots = (startTime: string, endTime: string, duration: number): string[] => {
  const slots: string[] = [];
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  
  while (start < end) {
    slots.push(start.toTimeString().slice(0, 5));
    start.setMinutes(start.getMinutes() + duration);
  }
  
  return slots;
};

export const isValidTimeSlot = (date: Date, time: string): boolean => {
  const now = new Date();
  const bookingDateTime = new Date(`${date.toDateString()} ${time}`);
  return bookingDateTime > now;
};

export const formatResponse = (success: boolean, data?: any, error?: string) => {
  return {
    success,
    ...(data && { data }),
    ...(error && { error })
  };
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};