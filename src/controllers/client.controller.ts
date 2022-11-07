import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Client from '../models/client.model';
import { uid } from 'rand-token';
dotenv.config();

export enum Role {
  ADMIN = 'admin',
  CLIENT = 'client',
  DOCTOR = 'doctor',
  ASSISTANT = 'assistant',
  CLINIC_ADMIN = 'clinicAdmin',
}

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
const secretKey = process.env.TOKEN_SECRET as jwt.Secret;

export type ClientType = {
  _id?: string;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  password?: string;
  phone: string;
  gender?: string;
  image?: string;
  birthDate?: string;
  lastVisit?: string;
  status: string;
  confirmationCode?: string;
  forgotPasswordToken?: string;
};

export class ClientModel {
  async setPassword(password: string): Promise<string> {
    const hashedPassword = bcrypt.hashSync(
      password + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    );
    return hashedPassword;
  }

  async validPassword(
    password: string,
    clientPassword: string
  ): Promise<boolean> {
    return bcrypt.compareSync(password + BCRYPT_PASSWORD, clientPassword);
  }

  async generateJWT(client: ClientType): Promise<string> {
    return jwt.sign(
      {
        id: client._id,
        email: client.email,
        role: Role.CLIENT,
      },
      secretKey,
      { expiresIn: '24h' }
    );
  }

  async login(email: string, password: string): Promise<ClientType | null> {
    try {
      const client = await Client.findOne({ email: email });
      if (client) {
        if (await this.validPassword(password, client.password)) {
          return client;
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

  async index(): Promise<ClientType[]> {
    try {
      const clients = await Client.find({}, { password: 0 });
      return clients;
    } catch (err) {
      throw new Error(`Could not find any clients => ${err}`);
    }
  }

  async create(client: ClientType): Promise<ClientType> {
    try {
      const newClient = new Client(client);
      const token = uid(64);
      // await jwt.sign(client.email, secretKey);

      newClient.password = await this.setPassword(client.password as string);
      newClient.confirmationCode = token;
      return await newClient.save();
    } catch (err) {
      throw new Error(`Could not create this client => ${err}`);
    }
  }

  async update(id: string, client: ClientType): Promise<ClientType> {
    try {
      const updatedClient = await Client.findByIdAndUpdate(id, client, {
        new: true,
      });
      return updatedClient;
    } catch (err) {
      throw new Error(`Could not update this client => ${err}`);
    }
  }

  async show(id: string): Promise<ClientType | null> {
    try {
      const clientToShow = await Client.findById(id);
      return clientToShow;
    } catch (err) {
      throw new Error(`Could not show this client => ${err}`);
    }
  }

  async delete(id: string): Promise<ClientType | null> {
    try {
      const deletedClient = await Client.findByIdAndDelete(id);
      return deletedClient;
    } catch (err) {
      throw new Error(`Could not delete this client => ${err}`);
    }
  }

  async findByPassword(
    id: string,
    password: string
  ): Promise<ClientType | null> {
    try {
      const client = await Client.findOne({
        _id: id,
      });
      if (await this.validPassword(password, client.password)) {
        return client;
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(`Could not find this client => ${err}`);
    }
  }

  async updatePassword(id: string, password: string): Promise<ClientType> {
    try {
      const hash = await this.setPassword(password);
      const updatedClient = await Client.findByIdAndUpdate(
        id,
        { password: hash },
        { new: true }
      );
      return updatedClient;
    } catch (err) {
      throw new Error(`Could not update this client => ${err}`);
    }
  }
}
const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env;
type option = {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
};
// export const isUser = async (email: string): Promise<boolean> => {
//   const existedUser = await Client.find({ email });
//   return existedUser ? true : false;
// };
export const makePasswordResetToken = async (
  email: string
): Promise<ClientType> => {
  // const token = Math.ceil(Math.random() * 100000);
  const token = uid(64);
  // await jwt.sign(email, secretKey);

  const time = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
  try {
    const client = await Client.findOneAndUpdate(
      { email },
      { forgotPasswordToken: token, forgotPasswordExpiresIn: time },
      { new: true }
    );
    return client;
  } catch (error) {
    throw new Error(error as string);
  }
};
export const sendEmail = async (options: option): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: EMAIL_HOST,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};
export const changePassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    const model = new ClientModel();
    const hashedPassword = await model.setPassword(newPassword);
    console.log(token, hashedPassword);
    await Client.findOneAndUpdate(
      { forgotPasswordToken: token },
      { password: hashedPassword }
    );
  } catch (err) {
    console.log(err);
    throw new Error(`Could not find user`);
  }
};
export const verifyEmail = async (code: string): Promise<boolean> => {
  const client: ClientType | null = await Client.findOneAndUpdate(
    { confirmationCode: code },
    { status: 'Active' }
  );
  return client ? true : false;
};
