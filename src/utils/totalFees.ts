import { TAppointmentFees } from "../types";
export function totalFees(appointmentFees: TAppointmentFees) {
  const servicesFees = appointmentFees.services.reduce(
    (acc: number, service) => {
      // Check if service_fee is a valid number
      const serviceFee = !isNaN(parseFloat(service.service_fee))
        ? parseFloat(service.service_fee)
        : 0;
      return acc + serviceFee;
    },
    0,
  );
  // Check if fee is a valid number
  const fee = !isNaN(parseFloat(appointmentFees.fee))
    ? parseFloat(appointmentFees.fee)
    : 0;
  return servicesFees + fee;
}
