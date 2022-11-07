import Reservation from './../models/reservation.model';
import { Status } from './../models/reservation.model';

export type ReservationType = {
  _id: string;
  amount_paid: number;
  status: Status;
  date: Date;
  clinic_id: string;
  doctor_id: string;
  client_id: string;
};

export class ReservationController {
  public static async create(
    reservation: ReservationType
  ): Promise<ReservationType> {
    try {
      return await Reservation.create(reservation);
    } catch (err) {
      throw new Error(`Could not create this reservation => ${err}`);
    }
  }

  public static async update(
    reservationId: string,
    status: Status
  ): Promise<ReservationType> {
    try {
      const updatedReservation = await Reservation.findByIdAndUpdate(
        reservationId,
        { status },
        {
          new: true,
        }
      );
      return updatedReservation;
    } catch (err) {
      throw new Error(`Could not update this Reservation => ${err}`);
    }
  }

  public static async getClinicReservations(
    clinicId: string
  ): Promise<ReservationType[]> {
    try {
      return await Reservation.find({ clinic: clinicId });
    } catch (err) {
      throw new Error(`Could not get Reservations => ${err}`);
    }
  }

  public static async getOne(id: string): Promise<ReservationType | null> {
    try {
      return await Reservation.findById(id);
    } catch (err) {
      throw new Error(`Could not get this Reservation => ${err}`);
    }
  }

  public static async delete(id: string): Promise<ReservationType | null> {
    try {
      return await Reservation.findByIdAndDelete(id);
    } catch (err) {
      throw new Error(`Could not delete this Reservation => ${err}`);
    }
  }
}
