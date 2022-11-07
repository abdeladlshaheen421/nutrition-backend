import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ClinicAdminModel from './../models/clinicadmin.model';
import { Role } from './client.controller';

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
const secretKey = process.env.TOKEN_SECRET as jwt.Secret;

export type ClinicAdminType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: number;
  birthDate: Date;
  nationalId: number;
  image: string;
};

export class ClinicAdminController {
  public static async create(
    clinicAdmin: ClinicAdminType
  ): Promise<ClinicAdminType> {
    return await ClinicAdminModel.create(clinicAdmin);
  }

  public static async getAll(): Promise<ClinicAdminType[]> {
    return await ClinicAdminModel.find();
  }

  public static async getOne(id: string): Promise<ClinicAdminType | null> {
    return await ClinicAdminModel.findById(id);
  }

  public static async update(
    id: string,
    clinicAdmin: ClinicAdminType
  ): Promise<ClinicAdminType | null> {
    return await ClinicAdminModel.findByIdAndUpdate(id, clinicAdmin);
  }

  public static async delete(id: string): Promise<ClinicAdminType | null> {
    return await ClinicAdminModel.findByIdAndDelete(id);
  }

  public static async validPassword(
    password: string,
    clientPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password + BCRYPT_PASSWORD, clientPassword);
  }

  public static async login(
    email: string,
    password: string
  ): Promise<ClinicAdminType | null> {
    try {
      const clinicAdmin = await ClinicAdminModel.findOne({ email: email });
      if (clinicAdmin) {
        if (await this.validPassword(password, clinicAdmin.password)) {
          return clinicAdmin;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not find this user ${email} => ${err}`);
    }
  }

  public static async generateJWT(
    clinicAdmin: ClinicAdminType
  ): Promise<string> {
    return jwt.sign(
      {
        id: clinicAdmin._id,
        email: clinicAdmin.email,
        role: Role.ADMIN,
      },
      secretKey,
      { expiresIn: '24h' }
    );
  }

  public static async findByPassword(
    id: string,
    password: string
  ): Promise<ClinicAdminType | null> {
    try {
      const clinicAdmin = await ClinicAdminModel.findOne({
        _id: id,
      });
      if (await this.validPassword(password, clinicAdmin.password)) {
        return clinicAdmin;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not find this user ${password} => ${err}`);
    }
  }

  public static async setPassword(password: string): Promise<string> {
    const hashedPassword = bcrypt.hashSync(
      password + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    );
    return hashedPassword;
  }

  public static async updatePassword(
    id: string,
    password: string
  ): Promise<ClinicAdminType> {
    try {
      const hash = await this.setPassword(password);
      const updatedClinicAdmin = await ClinicAdminModel.findByIdAndUpdate(
        id,
        { password: hash },
        { new: true }
      );
      return updatedClinicAdmin;
    } catch (err) {
      throw new Error(`Could not find this user ${id} => ${err}`);
    }
  }
}
