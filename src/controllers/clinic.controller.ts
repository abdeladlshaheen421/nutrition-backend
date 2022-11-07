import Clinic from '../models/clinic.model';

export type ClinicType = {
  name: string;
  email: string;
  location: string;
  waitingTime: Date;
  opensAt: Date;
  closesAt: Date;
  phone: string;
  price: Date;
  clinicAdmin: Date;
  image?: Date;
};

const index = async (): Promise<ClinicType[] | null> => {
  try {
    const clinics = await Clinic.find({});
    return clinics;
  } catch (error) {
    throw new Error(error as string);
  }
};

const show = async (clinicId: string) => {
  try {
    const clinic = await Clinic.findById(clinicId);
    return clinic;
  } catch (error) {
    throw new Error(error as string);
  }
};

const create = (clinic: ClinicType): Promise<ClinicType | void> => {
  const newClinic = new Clinic(clinic);
  try {
    return newClinic.save();
  } catch (error) {
    throw new Error(error as string);
  }
};

const update = async (
  clinic: ClinicType,
  clinicId: string
): Promise<ClinicType | void> => {
  try {
    await Clinic.findByIdAndUpdate(clinicId, clinic);
    const updatedData: ClinicType = <ClinicType>await Clinic.findById(clinicId);
    return updatedData;
  } catch (error) {
    throw new Error(error as string);
  }
};

const destroy = async (clinicId: string): Promise<void> => {
  try {
    await Clinic.findByIdAndRemove(clinicId);
  } catch (error) {
    throw new Error(error as string);
  }
};

const search = async (text: string) => {
  try {
    const Clinics = await Clinic.find({ $text: { $search: text } });
    return Clinics;
  } catch (error) {
    throw new Error(error as string);
  }
};

const getAdminClinic = async (adminId: string): Promise<ClinicType | null> => {
  try {
    const clinic = await Clinic.findOne({ clinicAdmin: adminId });
    return clinic;
  } catch (error) {
    throw new Error(error as string);
  }
};
export default {
  index,
  show,
  create,
  update,
  destroy,
  search,
  getAdminClinic,
};
